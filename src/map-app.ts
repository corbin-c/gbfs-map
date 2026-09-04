import { provide } from '@lit/context';
import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import './search-field.js';
import './map.js';
import { proxified } from './cors-proxy.js';
import { AvailableBike } from './types.js';
import { bikesContext } from './bikes-context.js';

@customElement('map-app')
export class MapApp extends LitElement {
  @state() results: string[][] = [];

  @provide({ context: bikesContext })
  @state()
  selected: Record<string, AvailableBike[]> = {};

  static styles = css`
    #search-form {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      width: 20rem;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      background: #ededed;
      ul {
        padding: 0;
        margin: 0;
        list-style-type: none;
        input {
          margin-right: 0.5rem;
        }
      }
    }
  `;

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
                      @change="${async (event: Event) => {
                        const target = event.target as HTMLInputElement;
                        if (!target) {
                          return;
                        }
                        if (target.checked) {
                          // do proper error / loading managment
                          const url = e[5];
                          const gbfsResponse = await fetch(proxified(url));
                          const gbfs = await gbfsResponse.json();
                          const enData = gbfs.data.en;
                          const availableBikesUrl = enData?.feeds?.find(
                            (f: { name: string }) =>
                              f.name === 'free_bike_status',
                          )?.url;
                          if (!availableBikesUrl) {
                            return;
                          }
                          const availableBikesResponse = await fetch(
                            proxified(availableBikesUrl),
                          );
                          const availableBikes =
                            await availableBikesResponse.json();
                          this.selected = {
                            ...this.selected,
                            [e[5]]: availableBikes.data.bikes,
                          };
                        } else {
                          const next = { ...this.selected };
                          delete next[e[5]];
                          this.selected = next;
                        }
                        console.log(this.selected);
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
