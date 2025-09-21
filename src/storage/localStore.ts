import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Highlight {
  id: string;
  verseId: string;
  color: string;
  timestamp: number;
}

export interface Note {
  id: string;
  verseId: string;
  text: string;
  timestamp: number;
}

export interface Bookmark {
  id: string;
  verseId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  timestamp: number;
}

export interface HistoryItem {
  id: string;
  verseId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  timestamp: number;
}

class LocalStore {
  private readonly KEYS = {
    HIGHLIGHTS: 'bible_highlights',
    NOTES: 'bible_notes',
    BOOKMARKS: 'bible_bookmarks',
    HISTORY: 'bible_history',
  };

  // Highlights - save highlight to async
  async saveHighlight(verseId: string, color: string): Promise<void> {
    try {
      const highlights = await this.getHighlights();
      const highlight: Highlight = {
        id: Date.now().toString(),
        verseId,
        color,
        timestamp: Date.now(),
      };
      
      highlights.push(highlight);
      await AsyncStorage.setItem(this.KEYS.HIGHLIGHTS, JSON.stringify(highlights));
    } catch (error) {
      console.error('Failed to save highlight:', error);
      throw error;
    }
  }

  // Highlights - get highlights from async
  async getHighlights(): Promise<Highlight[]> {
    try {
      const data = await AsyncStorage.getItem(this.KEYS.HIGHLIGHTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get highlights:', error);
      return [];
    }
  }

  // Highlight - remove saved highlight from async
  async removeHighlight(highlightId: string): Promise<void> {
    try {
      const highlights = await this.getHighlights();
      const filtered = highlights.filter(h => h.id !== highlightId);
      await AsyncStorage.setItem(this.KEYS.HIGHLIGHTS, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to remove highlight:', error);
      throw error;
    }
  }

  // Notes
  async saveNote(verseId: string, text: string): Promise<void> {
    try {
      const notes = await this.getNotes();
      const note: Note = {
        id: Date.now().toString(),
        verseId,
        text,
        timestamp: Date.now(),
      };
      
      notes.push(note);
      await AsyncStorage.setItem(this.KEYS.NOTES, JSON.stringify(notes));
    } catch (error) {
      console.error('Failed to save note:', error);
      throw error;
    }
  }

  async getNotes(): Promise<Note[]> {
    try {
      const data = await AsyncStorage.getItem(this.KEYS.NOTES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get notes:', error);
      return [];
    }
  }

  async updateNote(noteId: string, text: string): Promise<void> {
    try {
      const notes = await this.getNotes();
      const noteIndex = notes.findIndex(n => n.id === noteId);
      if (noteIndex !== -1) {
        notes[noteIndex].text = text;
        await AsyncStorage.setItem(this.KEYS.NOTES, JSON.stringify(notes));
      }
    } catch (error) {
      console.error('Failed to update note:', error);
      throw error;
    }
  }

  async removeNote(noteId: string): Promise<void> {
    try {
      const notes = await this.getNotes();
      const filtered = notes.filter(n => n.id !== noteId);
      await AsyncStorage.setItem(this.KEYS.NOTES, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to remove note:', error);
      throw error;
    }
  }

  // Bookmarks
  async saveBookmark(verseId: string, bookName: string, chapter: number, verse: number, text: string): Promise<void> {
    try {
      const bookmarks = await this.getBookmarks();
      const bookmark: Bookmark = {
        id: Date.now().toString(),
        verseId,
        bookName,
        chapter,
        verse,
        text,
        timestamp: Date.now(),
      };
      
      bookmarks.push(bookmark);
      await AsyncStorage.setItem(this.KEYS.BOOKMARKS, JSON.stringify(bookmarks));
    } catch (error) {
      console.error('Failed to save bookmark:', error);
      throw error;
    }
  }

  async getBookmarks(): Promise<Bookmark[]> {
    try {
      const data = await AsyncStorage.getItem(this.KEYS.BOOKMARKS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get bookmarks:', error);
      return [];
    }
  }

  async removeBookmark(bookmarkId: string): Promise<void> {
    try {
      const bookmarks = await this.getBookmarks();
      const filtered = bookmarks.filter(b => b.id !== bookmarkId);
      await AsyncStorage.setItem(this.KEYS.BOOKMARKS, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
      throw error;
    }
  }

  // History
  async addToHistory(verseId: string, bookName: string, chapter: number, verse: number, text: string): Promise<void> {
    try {
      const history = await this.getHistory();
      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        verseId,
        bookName,
        chapter,
        verse,
        text,
        timestamp: Date.now(),
      };
      
      // Remove any existing entry for this verse
      const filtered = history.filter(h => h.verseId !== verseId);
      filtered.unshift(historyItem);
      
      // Keep only last 100 items
      const limited = filtered.slice(0, 100);
      await AsyncStorage.setItem(this.KEYS.HISTORY, JSON.stringify(limited));
    } catch (error) {
      console.error('Failed to add to history:', error);
      throw error;
    }
  }

  async getHistory(): Promise<HistoryItem[]> {
    try {
      const data = await AsyncStorage.getItem(this.KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get history:', error);
      return [];
    }
  }

  async clearHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.KEYS.HISTORY);
    } catch (error) {
      console.error('Failed to clear history:', error);
      throw error;
    }
  }

  // Utility methods
  async clearAllData(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(this.KEYS.HIGHLIGHTS),
        AsyncStorage.removeItem(this.KEYS.NOTES),
        AsyncStorage.removeItem(this.KEYS.BOOKMARKS),
        AsyncStorage.removeItem(this.KEYS.HISTORY),
      ]);
    } catch (error) {
      console.error('Failed to clear all data:', error);
      throw error;
    }
  }
}

export const localStore = new LocalStore();
