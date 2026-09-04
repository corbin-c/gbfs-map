import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { proxified } from './cors-proxy.js';

const csv =
  'https://raw.githubusercontent.com/MobilityData/gbfs/refs/heads/master/systems.csv';

@customElement('search-field')
export class SearchField extends LitElement {
  @state() gbfsSystems: string[][] = [];

  @state() searchValue = '';

  constructor() {
    super();
    (async () => {
      try {
        const csvResponse = await fetch(proxified(csv));
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
