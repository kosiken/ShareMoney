/* eslint-disable @typescript-eslint/no-unused-vars */
import {Persistence} from './persistence';
import SQLite from 'react-native-sqlite-storage';
import uuid from 'react-native-uuid';

const sql = `
CREATE TABLE IF NOT EXISTS contacts
( contact_id CHAR(64) NOT NULL,
  phone VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  phone_prefix CHAR(4) NOT NULL,
  created_at INTEGER,
  CONSTRAINT contacts_pk PRIMARY KEY (contact_id)
);
`;
class SqlLiteApi implements Persistence {
  public static get Instance(): Persistence {
    return SqlLiteApi._instance || (SqlLiteApi._instance = new SqlLiteApi());
  }

  public static createInsertQuery(
    tableName: string,
    values: Array<Record<string, number | string>>,
  ): string {
    // abeg no vex
    let ret = `INSERT INTO ${tableName} (${Object.keys(values[0]).join(
      ', ',
    )}) values\n`;
    ret += values
      .map(v => {
        return (
          '(' +
          Object.values(v)
            .map(value =>
              typeof value === 'string' ? `'${value}'` : `${value}`,
            )
            .join(', ') +
          ')'
        );
      })
      .join(',');
    return ret + ';';
  }
  public static createWhereStatement(
    args: Record<string, number | string>,
  ): string {
    const values = Object.values(args);
    const keys = Object.keys(args);
    if (keys.length === 0) {
      return '';
    }
    let str = 'WHERE';
    for (let i = 0; i < keys.length; i++) {
      const item = values[i];
      const prop = keys[i];
      let add = '';
      if (i < keys.length - 1) {
        add = 'OR';
      }

      if (typeof item === 'string') {
        str += ` ${prop} = '${item as string}' ${add} \n `;
      } else {
        str += ` ${prop} = ${item} ${add} \n `;
      }
    }
    return str;
  }

  public static createSetStatement(
    args: Record<string, number | string>,
  ): string {
    let str = 'SET';
    for (const item in args) {
      if (typeof args[item] === 'string') {
        str += ` ${item} = '${args[item]}'\n,`;
      } else {
        str += ` ${item} = ${args[item]}\n,`;
      }
    }
    return str;
  }
  private static _instance: SqlLiteApi;
  private db?: SQLite.SQLiteDatabase;
  constructor() {
    SQLite.enablePromise(true);
  }
  public async initDatabase(): Promise<boolean> {
    if (this.db) {
      return true;
    }
    this.db = await SQLite.openDatabase({
      name: 'sharemoney.db',
      location: 'default',
    });
    await this.db.executeSql(sql);
    try {
      await this.testDb();
      // tslint:disable: no-console
      console.log('success');
    } catch (err) {
      console.log((err as any).message);
      delete this.db;
    }

    return true;
  }
  public saveOne<T>(item: T, params?: Record<string, any>): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  public async saveMany<T>(
    items: T[],
    params?: Record<string, any>,
  ): Promise<boolean> {
    try {
      await this.db!.executeSql(
        SqlLiteApi.createInsertQuery(params!.tableName, items as any),
      );
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
  public getOne<T>(query: any, params?: Record<string, any>): Promise<T> {
    throw new Error('Method not implemented.');
  }
  public async getMany<T>(
    query: any,
    params?: Record<string, any>,
  ): Promise<T[]> {
    const tableName = params!.tableName;
    const theQuery =
      'SELECT * FROM ' +
      tableName +
      ' ' +
      SqlLiteApi.createWhereStatement(
        query as Record<string, number | string>,
      ) +
      ' ;';
    const results = await this.db!.executeSql(theQuery);
    const ret: T[] = [];
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        ret.push(result.rows.item(index));
      }
    });

    return ret;
  }
  public deleteOne(query: any, params?: Record<string, any>): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  public deleteMany(query: any, params?: Record<string, any>): Promise<number> {
    throw new Error('Method not implemented.');
  }
  public updateOne(
    query: any,
    updates: Record<string, any>,
    params?: Record<string, any>,
  ): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  public updateMany(
    query: any,
    updates: Record<string, any>,
    params?: Record<string, any>,
  ): Promise<number> {
    throw new Error('Method not implemented.');
  }
  public async testDb(): Promise<boolean> {
    const ans = await this.db!.executeSql(
      SqlLiteApi.createInsertQuery('contacts', [
        {
          contact_id: '627a540425a6e21a2b840c19',
          phone: '8146392214',
          phone_prefix: '+234',
          name: 'Kosy Allison',
          created_at: Date.now(),
        },
      ]),
    );

    await this.db!.executeSql(
      'DELETE from contacts ' +
        SqlLiteApi.createWhereStatement({
          contact_id: '627a540425a6e21a2b840c19',
        }) +
        ';',
    );
    console.log('ran here -> ', ans);
    return true;
  }
}

export default SqlLiteApi.Instance;
