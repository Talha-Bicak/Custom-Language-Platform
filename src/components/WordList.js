class WordList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.words = [];
  }

  connectedCallback() {
    this.render();
    this.setupForm();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        .word-form {
          background: white;
          padding: 20px;
          border-radius: 4px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .form-group {
          margin-bottom: 15px;
        }

        input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
          margin-bottom: 10px;
        }

        button {
          background-color: #4a90e2;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s;
        }

        button:hover {
          background-color: #357abd;
        }

        .word-list {
          display: grid;
          gap: 15px;
        }

        .empty-message {
          text-align: center;
          color: #666;
          padding: 20px;
        }
      </style>

      <div class="word-form">
        <div class="form-group">
          <input type="text" id="wordInput" placeholder="Yeni kelime" required>
          <input type="text" id="translationInput" placeholder="Çevirisi" required>
          <input type="text" id="contextInput" placeholder="Örnek cümle">
        </div>
        <button id="addWordBtn">Kelime Ekle</button>
      </div>

      <div class="word-list">
        ${this.renderWords()}
      </div>
    `;
  }

  renderWords() {
    if (this.words.length === 0) {
      return '<div class="empty-message">Henüz kelime eklenmemiş.</div>';
    }

    return this.words
      .map(
        (word) => `
        <word-card
          word="${word.word}"
          translation="${word.translation}"
          context="${word.context || ''}"
        ></word-card>
      `
      )
      .join('');
  }

  setupForm() {
    const addWordBtn = this.shadowRoot.querySelector('#addWordBtn');
    const wordInput = this.shadowRoot.querySelector('#wordInput');
    const translationInput = this.shadowRoot.querySelector('#translationInput');
    const contextInput = this.shadowRoot.querySelector('#contextInput');

    addWordBtn.addEventListener('click', () => {
      const word = wordInput.value.trim();
      const translation = translationInput.value.trim();
      const context = contextInput.value.trim();

      if (word && translation) {
        this.addWord({
          word,
          translation,
          context,
        });

        // Form temizleme
        wordInput.value = '';
        translationInput.value = '';
        contextInput.value = '';
      }
    });

    // Kelime kartı olaylarını dinleme
    this.shadowRoot.addEventListener('edit', (e) => {
      this.dispatchEvent(
        new CustomEvent('editWord', {
          detail: e.detail,
          bubbles: true,
          composed: true,
        })
      );
    });

    this.shadowRoot.addEventListener('delete', (e) => {
      this.dispatchEvent(
        new CustomEvent('deleteWord', {
          detail: e.detail,
          bubbles: true,
          composed: true,
        })
      );
    });
  }

  addWord(wordData) {
    this.words.push(wordData);
    this.render();

    this.dispatchEvent(
      new CustomEvent('wordAdded', {
        detail: wordData,
        bubbles: true,
        composed: true,
      })
    );
  }

  updateWords(newWords) {
    this.words = newWords;
    this.render();
  }
}

customElements.define('word-list', WordList);