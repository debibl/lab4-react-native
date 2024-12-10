import { makeAutoObservable, runInAction } from 'mobx';
import { createContext } from 'react';
import * as SQLite from 'expo-sqlite';

const apiUrl = 'https://fakestoreapi.com';

export type RatingData = {
  count: number;
  rate: number;
};

export type ProductData = {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  rating: RatingData;
  title: string;
};

export type CheckoutItem = {
  id: number;
  item_id: number;
  count: number;
};

class DatabaseManager {
  private dbConn: SQLite.SQLiteDatabase | null = null;

  constructor(databaseName: string) {
    this.dbConn = SQLite.openDatabaseSync(databaseName);
    this.initializeDatabase();
  }

  private initializeDatabase() {
    this.dbConn?.execSync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS checkout (
        id INTEGER PRIMARY KEY NOT NULL,
        item_id INTEGER UNIQUE NOT NULL,
        count INTEGER NOT NULL
      );
    `);
  }

  closeDatabase() {
    this.dbConn?.closeSync();
    this.dbConn = null;
  }

  dropDatabase(databaseName: string) {
    this.closeDatabase();
    SQLite.deleteDatabaseSync(databaseName);
  }

  executeQuery(query: string, ...params: any[]) {
    this.dbConn?.runSync(query, ...params);
  }

  fetchAll<T>(query: string): T[] {
    return this.dbConn?.getAllSync<T>(query) || [];
  }
}

export class ProductsStore {
  private dbManager: DatabaseManager;
  products: ProductData[] = [];
  checkout: CheckoutItem[] = [];

  constructor() {
    this.dbManager = new DatabaseManager('db.db');
    makeAutoObservable(this);
    this.fetchCheckout();
  }

  dropDatabase() {
    this.dbManager.dropDatabase('db.db');
  }

  async fetchProducts() {
    try {
      const response = await fetch(`${apiUrl}/products`);
      const products = await response.json();
      runInAction(() => {
        this.products = products;
      });
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  }

  addCheckoutItem(itemId: number) {
    this.dbManager.executeQuery(
      'INSERT INTO checkout (item_id, count) VALUES (?, ?) ON CONFLICT(item_id) DO UPDATE SET count=count+1',
      itemId,
      1
    );
    this.fetchCheckout();
  }

  increaseCheckoutItem(id: number) {
    this.dbManager.executeQuery(
      'UPDATE checkout SET count=count+1 WHERE id = ?',
      id
    );
    this.fetchCheckout();
  }

  decreaseCheckoutItem(id: number) {
    const item = this.checkout.find((el) => el.id === id);
    if (!item) return;

    if (item.count === 1) {
      this.removeCheckoutItem(id);
    } else {
      this.dbManager.executeQuery(
        'UPDATE checkout SET count=count-1 WHERE id = ?',
        id
      );
      this.fetchCheckout();
    }
  }

  removeCheckoutItem(id: number) {
    this.dbManager.executeQuery('DELETE FROM checkout WHERE id = ?', id);
    this.fetchCheckout();
  }

  fetchCheckout() {
    const checkoutItems = this.dbManager.fetchAll<CheckoutItem>(
      'SELECT * FROM checkout'
    );
    runInAction(() => {
      this.checkout = checkoutItems;
    });
  }
}

const productsStore = new ProductsStore();
export const ProductsContext = createContext<ProductsStore>(productsStore);
