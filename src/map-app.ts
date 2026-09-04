import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import './search-field.js';
import './map.js';

@customElement('map-app')
export class MapApp extends LitElement {
  @state() results: string[][] = [];

  @state() selected: Record<string, string> = {};

  static styles = css``;

  private _handleOnResults(event: CustomEvent) {
    this.selected = {};
    this.results = event.detail;
  }

  render() {
    return html`
      <main>
        <div id="search-form">
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
        </div>
        <map-libre></map-libre>
      </main>
    `;
  }
}
