import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import * as maplibregl from 'maplibre-gl';

@customElement('map-libre')
export class MapLibre extends LitElement {
  @state() map: maplibregl.MapLibreMap | null = null;

  static styles = css`
    #map {
      width: 100vw;
      height: 100vh;
    }
  `;

  firstUpdated() {
    const mapNode = this.renderRoot.querySelector('#map');
    console.log(mapNode);
    if (!this.map && mapNode) {
      try {
        this.map = new maplibregl.Map({
          container: mapNode as HTMLElement, // container id
          style: 'https://demotiles.maplibre.org/style.json', // style URL
          center: [0, 0], // starting position [lng, lat]
          zoom: 1, // starting zoom
          maplibreLogo: true,
        });
      } catch (e) {
        console.error(e);
      }
    }
  }

  render() {
    console.log('rendered');
    return html`<div id="map"></div> `;
  }
}
