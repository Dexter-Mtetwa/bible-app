import * as SQLite from 'expo-sqlite';
import { BIBLE_BOOKS, SAMPLE_VERSES } from './bibleData';

export interface Verse {
  id: number;
  book: number;
  chapter: number;
  verse: number;
  text: string;
  book_name: string;
}

export interface Chapter {
  book: number;
  chapter: number;
  verses: Verse[];
}

export interface Book {
  id: number;
  name: string;
  testament: 'old' | 'new';
  chapter_count: number;
}

class BibleDB {
  private db: SQLite.SQLiteDatabase | null = null;

  async init(): Promise<void> {
    try {
      // For now, we'll create an in-memory database with sample data
      // In production, you would copy the bundled database file
      this.db = await SQLite.openDatabaseAsync('bible.db');
      
      // Create tables
      await this.createTables();
      
      // Insert sample data
      await this.insertSampleData();
    } catch (error) {
      console.error('Failed to initialize Bible database:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        testament TEXT NOT NULL,
        chapter_count INTEGER NOT NULL
      );
    `);

    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS verses (
        id INTEGER PRIMARY KEY,
        book INTEGER NOT NULL,
        chapter INTEGER NOT NULL,
        verse INTEGER NOT NULL,
        text TEXT NOT NULL,
        FOREIGN KEY (book) REFERENCES books (id)
      );
    `);
  }

  private async insertSampleData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Insert all Bible books
    for (const book of BIBLE_BOOKS) {
      await this.db.runAsync(
        'INSERT OR REPLACE INTO books (id, name, testament, chapter_count) VALUES (?, ?, ?, ?)',
        [book.id, book.name, book.testament, book.chapter_count]
      );
    }

    // Insert comprehensive sample verses
    for (const verse of SAMPLE_VERSES) {
      await this.db.runAsync(
        'INSERT OR REPLACE INTO verses (book, chapter, verse, text) VALUES (?, ?, ?, ?)',
        [verse.book, verse.chapter, verse.verse, verse.text]
      );
    }
  }

  async getBooks(): Promise<Book[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.getAllAsync('SELECT * FROM books ORDER BY id');
    return result as Book[];
  }

  async getBooksByTestament(testament: 'old' | 'new'): Promise<Book[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.getAllAsync(
      'SELECT * FROM books WHERE testament = ? ORDER BY id',
      [testament]
    );
    return result as Book[];
  }

  async getChapters(bookId: number): Promise<number[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.getAllAsync(
      'SELECT DISTINCT chapter FROM verses WHERE book = ? ORDER BY chapter',
      [bookId]
    );
    return result.map((row: any) => row.chapter);
  }

  async getChapter(bookId: number, chapter: number): Promise<Chapter> {
    if (!this.db) throw new Error('Database not initialized');
    
    const verses = await this.db.getAllAsync(
      `SELECT v.*, b.name as book_name 
       FROM verses v 
       JOIN books b ON v.book = b.id 
       WHERE v.book = ? AND v.chapter = ? 
       ORDER BY v.verse`,
      [bookId, chapter]
    ) as Verse[];

    return {
      book: bookId,
      chapter,
      verses
    };
  }

  async getVerse(bookId: number, chapter: number, verse: number): Promise<Verse | null> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.getFirstAsync(
      `SELECT v.*, b.name as book_name 
       FROM verses v 
       JOIN books b ON v.book = b.id 
       WHERE v.book = ? AND v.chapter = ? AND v.verse = ?`,
      [bookId, chapter, verse]
    );

    return result as Verse | null;
  }

  async searchVerses(keyword: string): Promise<Verse[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.getAllAsync(
      `SELECT v.*, b.name as book_name 
       FROM verses v 
       JOIN books b ON v.book = b.id 
       WHERE v.text LIKE ? 
       ORDER BY v.book, v.chapter, v.verse`,
      [`%${keyword}%`]
    );

    return result as Verse[];
  }

  async getVerseOfTheDay(): Promise<Verse> {
    if (!this.db) throw new Error('Database not initialized');
    
    // Get a random verse from the database
    const result = await this.db.getFirstAsync(
      `SELECT v.*, b.name as book_name 
       FROM verses v 
       JOIN books b ON v.book = b.id 
       ORDER BY RANDOM() 
       LIMIT 1`
    );

    if (!result) {
      throw new Error('No verses found in database');
    }

    return result as Verse;
  }

  async getRandomVerse(): Promise<Verse> {
    return this.getVerseOfTheDay();
  }

  async getChapters(bookId: number): Promise<number[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.getAllAsync(
      'SELECT DISTINCT chapter FROM verses WHERE book = ? ORDER BY chapter',
      [bookId]
    );

    return result.map((row: any) => row.chapter);
  }
}

export const bibleDB = new BibleDB();
