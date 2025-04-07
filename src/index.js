// Kelime koleksiyonu için temel veri yapısı
class VocabularyCollection {
  constructor() {
    this.words = new Map();
  }

  // Yeni kelime ekleme
  addWord(word, translation, context = '') {
    this.words.set(word, {
      translation,
      context,
      dateAdded: new Date(),
      reviewCount: 0,
      lastReviewed: null
    });
  }

  // Kelime getirme
  getWord(word) {
    return this.words.get(word);
  }

  // Kelime listesi
  getAllWords() {
    return Array.from(this.words.entries()).map(([word, details]) => ({
      word,
      ...details
    }));
  }

  // Tekrar için kelime seçme
  getWordsForReview(count = 10) {
    return this.getAllWords()
      .sort((a, b) => {
        if (!a.lastReviewed) return -1;
        if (!b.lastReviewed) return 1;
        return a.lastReviewed - b.lastReviewed;
      })
      .slice(0, count);
  }
}

// Örnek kullanım
const vocabulary = new VocabularyCollection();

// Kelime ekleme örnekleri
vocabulary.addWord('ephemeral', 'geçici', 'The ephemeral nature of social media fame.');
vocabulary.addWord('ubiquitous', 'her yerde bulunan', 'Smartphones have become ubiquitous in modern life.');

// Kelimeleri listeleme
console.log('Tüm Kelimeler:', vocabulary.getAllWords());

// Tekrar için kelime getirme
console.log('Tekrar İçin Kelimeler:', vocabulary.getWordsForReview(5));