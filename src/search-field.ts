import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

const csv = new URL('../../data/gbfs-systems.csv', import.meta.url).href;

@customElement('search-field')
export class SearchField extends LitElement {
  @property({ type: Array<Array<String>> }) gbfsSystems: string[][] = [];

  @property({ type: String }) searchValue = '';

  constructor() {
    super();
    (async () => {
      try {
        const csvResponse = await fetch(csv);
        if (!csvResponse.ok) {
          throw new Error('error fetching csv');
        }
        const csvData = await csvResponse.text();
        this.gbfsSystems = csvData.split('\n').map(e => e.split(','));
      } catch {
        console.error('unable to load GBFS Systems list');
      }
    })();
  }

  private _updateValue = (event: Event) => {
    const element = <HTMLInputElement>event.target;
    if (!element) {
      return;
    }
    const searchValue = element.value;
    if (!searchValue) {
      return;
    }
    if (!this.gbfsSystems.length) {
      return;
    }
    const results = this.gbfsSystems.filter(e =>
      e.some(f => f.includes(searchValue)),
    );
    this.dispatchEvent(new CustomEvent('results', { detail: results }));
  };

  render() {
    return html`<input type="text" @keyup="${this._updateValue}" />`;
  }
}
