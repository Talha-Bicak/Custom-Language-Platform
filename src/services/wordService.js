// Kelime yönetimi için API servisi
class WordService {
  constructor() {
    this.baseUrl = 'https://api.vocably.pro/v1';
    this.words = new Map();
  }

  // Kelime ekleme
  async addWord(word, translation, context = '') {
    try {
      // API entegrasyonu gelene kadar yerel depolama
      const wordData = {
        word,
        translation,
        context,
        dateAdded: new Date(),
        reviewCount: 0,
        lastReviewed: null
      };

      this.words.set(word, wordData);
      return wordData;
    } catch (error) {
      console.error('Kelime eklenirken hata:', error);
      throw error;
    }
  }

  // Kelime getirme
  async getWord(word) {
    try {
      return this.words.get(word);
    } catch (error) {
      console.error('Kelime getirilirken hata:', error);
      throw error;
    }
  }

  // Tüm kelimeleri getirme
  async getAllWords() {
    try {
      return Array.from(this.words.entries()).map(([word, details]) => ({
        word,
        ...details
      }));
    } catch (error) {
      console.error('Kelimeler listelenirken hata:', error);
      throw error;
    }
  }

  // Kelime silme
  async deleteWord(word) {
    try {
      return this.words.delete(word);
    } catch (error) {
      console.error('Kelime silinirken hata:', error);
      throw error;
    }
  }

  // Kelime güncelleme
  async updateWord(word, updates) {
    try {
      const currentWord = this.words.get(word);
      if (!currentWord) {
        throw new Error('Kelime bulunamadı');
      }

      const updatedWord = {
        ...currentWord,
        ...updates,
        lastModified: new Date()
      };

      this.words.set(word, updatedWord);
      return updatedWord;
    } catch (error) {
      console.error('Kelime güncellenirken hata:', error);
      throw error;
    }
  }

  // Tekrar için kelime getirme
  async getWordsForReview(count = 10) {
    try {
      return Array.from(this.words.values())
        .sort((a, b) => {
          if (!a.lastReviewed) return -1;
          if (!b.lastReviewed) return 1;
          return new Date(a.lastReviewed) - new Date(b.lastReviewed);
        })
        .slice(0, count);
    } catch (error) {
      console.error('Tekrar kelimeleri getirilirken hata:', error);
      throw error;
    }
  }
}

export default WordService;