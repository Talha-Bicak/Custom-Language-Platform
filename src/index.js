import './components/WordCard.js';
import './components/WordList.js';
import WordService from './services/wordService.js';

class App {
  constructor() {
    this.wordService = new WordService();
    this.wordList = document.querySelector('word-list');
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Kelime ekleme olayını dinleme
    this.wordList.addEventListener('wordAdded', async (e) => {
      try {
        const wordData = e.detail;
        await this.wordService.addWord(
          wordData.word,
          wordData.translation,
          wordData.context
        );
        this.updateWordList();
      } catch (error) {
        console.error('Kelime eklenirken hata:', error);
      }
    });

    // Kelime silme olayını dinleme
    this.wordList.addEventListener('deleteWord', async (e) => {
      try {
        const { word } = e.detail;
        await this.wordService.deleteWord(word);
        this.updateWordList();
      } catch (error) {
        console.error('Kelime silinirken hata:', error);
      }
    });

    // Kelime düzenleme olayını dinleme
    this.wordList.addEventListener('editWord', async (e) => {
      try {
        const wordData = e.detail;
        await this.wordService.updateWord(wordData.word, wordData);
        this.updateWordList();
      } catch (error) {
        console.error('Kelime güncellenirken hata:', error);
      }
    });
  }

  async updateWordList() {
    try {
      const words = await this.wordService.getAllWords();
      this.wordList.updateWords(words);
    } catch (error) {
      console.error('Kelime listesi güncellenirken hata:', error);
    }
  }
}

// Uygulama başlatma
document.addEventListener('DOMContentLoaded', () => {
  new App();
});