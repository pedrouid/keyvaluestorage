import { DataTypes, Op, Sequelize, Transaction } from 'sequelize';
import { mkdirSync } from 'fs';
import { dirname } from 'path';

import { IKeyValueStorage, KeyValueStorageOptions } from '../shared';
import { getNodeJSOptions } from '../shared/utils';

export class KeyValueStorage implements IKeyValueStorage {
  public sequelize: Sequelize;
  private KeyValueStorageData: any;

  // FIXME: Using transactions in the memory store passes the store tests
  // but fails in the integration tests. This only happens for memory store,
  // and there are similarly reported issues. See:
  // https://github.com/sequelize/sequelize/issues/8759
  private shouldUseTransaction: boolean = true;

  constructor(opts?: KeyValueStorageOptions) {
    const options = getNodeJSOptions(opts);
    this.sequelize = this.setSequelize(options.sequelize);
    this.KeyValueStorageData = this.sequelize.define(options.tableName, {
      key: {
        type: new DataTypes.STRING(1024),
        primaryKey: true,
      },
      value: {
        type:
          this.sequelize.getDialect() === 'postgres'
            ? DataTypes.JSON
            : DataTypes.JSONB,
      },
    });
  }

  ////////////////////////////////////////
  // Public Methods

  async init(): Promise<void> {
    await this.sequelize.sync({ force: false });
  }

  close(): Promise<void> {
    return this.sequelize.close();
  }

  async getKeys(): Promise<string[]> {
    const relevantItems = await this.getRelevantItems();
    return relevantItems.map((item: any) => item.key.split(``)[1]);
  }

  async getEntries(): Promise<[string, any][]> {
    const relevantItems = await this.getRelevantItems();
    return relevantItems.map(item => [item.key.replace(``, ''), item.value]);
  }

  async getItem<T>(key: string): Promise<T | undefined> {
    try {
      const item = await this.KeyValueStorageData.findByPk(`${key}`);
      // TODO: fix type casting
      return item && (item.value as any);
    } catch (e) {
      throw new Error(`getItem(${key}) failed: ${e.message}`);
    }
  }

  async setItem(key: string, value: any): Promise<void> {
    const execute = async (options = {}) => {
      try {
        await this.KeyValueStorageData.upsert(
          {
            key: `${key}`,
            value,
          },
          options
        );
      } catch (e) {
        throw new Error(`setItem(${key}, ${value}) failed: ${e.message}`);
      }
    };
    return !this.shouldUseTransaction
      ? await execute()
      : await this.sequelize.transaction(async t =>
          execute({ transaction: t, lock: true })
        );
  }

  async removeItem(key: string): Promise<void> {
    const execute = async (options = {}) => {
      try {
        await this.KeyValueStorageData.destroy(
          { where: { key: `${key}` } },
          options
        );
      } catch (e) {
        throw new Error(`removeItem(${key}) failed: ${e.message}`);
      }
    };
    return !this.shouldUseTransaction
      ? await execute()
      : await this.sequelize.transaction(async t =>
          execute({ transaction: t, lock: true })
        );
  }

  ////////////////////////////////////////
  // Private Methods

  private async getRelevantItems(): Promise<any[]> {
    try {
      return this.KeyValueStorageData.findAll({
        where: {
          key: {
            [Op.startsWith]: ``,
          },
        },
      });
    } catch (e) {
      throw new Error(`getRelevantItems() failed: ${e.message}`);
    }
  }

  private setSequelize(_sequelize: string | Sequelize): Sequelize {
    let sequelize: Sequelize;
    if (typeof _sequelize === 'string') {
      if ((_sequelize as string).startsWith('sqlite:')) {
        const dbPath = (_sequelize as string).split('sqlite:').pop();
        if (dbPath !== ':memory:') {
          const dir = dirname(dbPath || '');
          mkdirSync(dir, { recursive: true });
        } else {
          // see comments in prop declaration
          this.shouldUseTransaction = false;
        }
      }
      sequelize = new Sequelize(_sequelize as string, {
        logging: false,
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });
    } else {
      sequelize = _sequelize as Sequelize;
    }
    return sequelize;
  }
}

export default KeyValueStorage;
