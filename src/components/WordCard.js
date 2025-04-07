class WordCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['word', 'translation', 'context'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    const word = this.getAttribute('word');
    const translation = this.getAttribute('translation');
    const context = this.getAttribute('context');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin: 10px 0;
        }

        .word-card {
          background: white;
          border-radius: 4px;
          padding: 16px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .word-card__word {
          font-size: 1.5em;
          color: #4a90e2;
          margin-bottom: 8px;
        }

        .word-card__translation {
          font-size: 1.2em;
          margin-bottom: 8px;
        }

        .word-card__context {
          font-style: italic;
          color: #666;
        }

        .word-card__actions {
          margin-top: 12px;
          display: flex;
          gap: 8px;
        }

        button {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.3s;
        }

        .edit-btn {
          background-color: #4a90e2;
          color: white;
        }

        .delete-btn {
          background-color: #e74c3c;
          color: white;
        }

        button:hover {
          opacity: 0.9;
        }
      </style>

      <div class="word-card">
        <div class="word-card__word">${word}</div>
        <div class="word-card__translation">${translation}</div>
        ${context ? `<div class="word-card__context">${context}</div>` : ''}
        <div class="word-card__actions">
          <button class="edit-btn">Düzenle</button>
          <button class="delete-btn">Sil</button>
        </div>
      </div>
    `;

    this.addEventListeners();
  }

  addEventListeners() {
    const editBtn = this.shadowRoot.querySelector('.edit-btn');
    const deleteBtn = this.shadowRoot.querySelector('.delete-btn');

    editBtn.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('edit', {
        detail: {
          word: this.getAttribute('word'),
          translation: this.getAttribute('translation'),
          context: this.getAttribute('context')
        },
        bubbles: true,
        composed: true
      }));
    });

    deleteBtn.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('delete', {
        detail: {
          word: this.getAttribute('word')
        },
        bubbles: true,
        composed: true
      }));
    });
  }
}

customElements.define('word-card', WordCard);