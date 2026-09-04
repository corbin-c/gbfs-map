import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import './search-field.js';

@customElement('map-app')
export class MapApp extends LitElement {
  @property({ type: String }) header = 'TEST';

  @property({ type: Array<Array<String>> }) results: string[][] = [];

  @property({ type: Object }) selected: Record<string, string> = {};

  static styles = css``;

  private _handleOnResults(event: CustomEvent) {
    this.selected = {};
    this.results = event.detail;
  }

  render() {
    return html`
      <main>
        <h1>${this.header}</h1>
        <search-field @results="${this._handleOnResults}"></search-field>
        <ul>
          ${repeat(
            this.results,
            e => e[5],
            e =>
              html` <li>
                <label
                  ><input
                    value="${e[5]}"
                    @change="${(event: Event) => {
                      const target = event.target as HTMLInputElement;
                      if (!target) {
                        return;
                      }
                      if (target.checked) {
                        // eslint-disable-next-line prefer-destructuring
                        this.selected[e[5]] = e[1];
                      } else {
                        delete this.selected[e[5]];
                      }
                    }}"
                    type="checkbox"
                  />${e[1]}</label
                >
              </li>`,
          )}
        </ul>
      </main>
    `;
  }
}
