import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import * as maplibregl from 'maplibre-gl';
import { consume } from '@lit/context';
import { AvailableBike } from './types.js';
import { bikesContext } from './bikes-context.js';

const PALETTE = [
  '#e6194b',
  '#3cb44b',
  '#ffe119',
  '#4363d8',
  '#f58231',
  '#911eb4',
  '#46f0f0',
  '#f032e6',
  '#bcf60c',
  '#fabebe',
  '#008080',
  '#e6beff',
  '#9a6324',
  '#800000',
  '#aaffc3',
];

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // keep 32-bit
  }
  return Math.abs(hash);
}

const colorForSource = (url: string) => PALETTE[hashCode(url) % PALETTE.length];

@customElement('map-libre')
export class MapLibre extends LitElement {
  @consume({ context: bikesContext, subscribe: true })
  availableBikes: Record<string, AvailableBike[]> = {};

  private map: maplibregl.MapLibreMap | null = null;

  static styles = css`
    #map {
      width: calc(100vw - 20rem);
      margin-left: 20rem;
      height: 100vh;
    }
    p {
      position: absolute;
      right: 0;
    }
  `;

  firstUpdated() {
    const mapNode = this.renderRoot.querySelector('#map');
    if (!this.map && mapNode) {
      try {
        this.map = new maplibregl.Map({
          container: mapNode as HTMLElement, // container id
          style: 'https://tiles.openfreemap.org/styles/bright',
          center: [0, 0], // starting position [lng, lat]
          zoom: 1, // starting zoom
          maplibreLogo: true,
        });
      } catch (e) {
        console.error(e);
      }
    }
  }

  private centerOnBikes() {
    if (!this.map) return;
    const bounds = new maplibregl.LngLatBounds();
    let any = false;
    for (const bikes of Object.values(this.availableBikes)) {
      for (const bike of bikes) {
        bounds.extend([bike.lon, bike.lat]);
        any = true;
      }
    }
    if (!any) return;

    this.map.fitBounds(bounds, {
      padding: 60, // pixels of breathing room around the edges
      maxZoom: 15, // don't zoom in absurdly close for a single bike
      duration: 1500, // ms (fitBounds animates; use 0 to jump)
    });
  }

  private handleBikeChange() {
    if (!this.map) {
      return;
    }
    const sources = Object.keys(this.availableBikes);
    const currentSources = Object.keys(this.map.getStyle().sources);
    currentSources.forEach(source => {
      if (source.startsWith('gbfs-') && !sources.includes(source)) {
        this.map?.removeLayer(source);
        this.map?.removeSource(source);
      }
    });
    Object.entries(this.availableBikes).forEach(entry => {
      const url = entry[0];
      const bikes = entry[1];
      const sourceId = 'gbfs-' + url;
      if (this.map?.getSource(sourceId)) {
        return;
      }
      this.map?.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: bikes.map(bike => ({
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: [bike.lon, bike.lat],
            },
          })),
        },
      });
      this.map?.addLayer({
        id: sourceId,
        type: 'circle',
        source: sourceId,
        paint: {
          'circle-color': colorForSource(url),
          'circle-radius': 6,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff',
        },
      });
    });
    this.centerOnBikes();
  }

  render() {
    this.handleBikeChange();
    return html` <div id="map"></div> `;
  }
}
