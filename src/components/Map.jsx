import { Component } from 'react';
import { DeckGL } from '@deck.gl/react';
import MapGL from 'react-map-gl/mapbox';
import { ScatterplotLayer, GeoJsonLayer, TextLayer, IconLayer } from '@deck.gl/layers';
import * as d3 from 'd3';

import 'mapbox-gl/dist/mapbox-gl.css';

import {
  MAPBOX_ACCESS_TOKEN,
  MAPBOX_STYLE,
  isMapboxConfigured,
} from '../mapbox-env';

const COLOR_GEO_TEXT = [0, 0, 0];
const COLOR_GEO_EDGE = [231, 225, 239, 255];
const COLOR_GEO_FILL = [136, 86, 167, 255];
const COLOR_RURAL = [158, 188, 218, 230];
const COLOR_NONRURAL = [200, 216, 224, 230];

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewState: {
        latitude: 31.968599,
        longitude: -99.90181,
        zoom: 5.5,
        maxZoom: 16,
        pitch: 10,
        bearing: 0,
      },
      width: 0,
      height: 0,
      pData: this.props.ProviderData,
    };

    this.layers = [];

    this.geoLayers = [];
    this.geoTextLayers = [];
    for (let i = 0; i < this.props.CountyData.length; i++) {
      const county = this.props.CountyData[i].county;
      const geoData =
        'https://raw.githubusercontent.com/belopot/medmaps/master/assets/geojson/TX/' +
        county +
        '.geo.json';
      const geoLayer = new GeoJsonLayer({
        id: 'geo_' + county,
        data: geoData,
        opacity: 1,
        stroked: true,
        filled: true,
        extruded: false,
        getElevation: 1,
        lineWidthMinPixels: 2,
        getFillColor: COLOR_GEO_FILL,
        getLineColor: COLOR_GEO_EDGE,
        pickable: false,
        transitions: {
          getFillColor: {
            duration: 5000,
            easing: d3.easeCubicInOut,
            enter: () => [COLOR_GEO_FILL[0], COLOR_GEO_FILL[1], COLOR_GEO_FILL[2], 0],
          },
          getLineColor: {
            duration: 5000,
            easing: d3.easeCubicInOut,
            enter: () => [COLOR_GEO_EDGE[0], COLOR_GEO_EDGE[1], COLOR_GEO_EDGE[2], 0],
          },
        },
      });
      this.geoLayers.push(geoLayer);

      const d = this.props.CountyCentroidData.filter((row) => row.county == county);
      if (d.length > 0) {
        const geoTextLayer = new TextLayer({
          id: 'geotext_' + county,
          data: d,
          getText: (row) => row.county,
          getPosition: (row) => [Number(row.longitude), Number(row.latitude), 5000],
          getColor: () => COLOR_GEO_TEXT,
          sizeUnits: 'meters',
          getSize: () => 10000,
          sizeScale: 1,
          parameters: {
            blend: true,
            blendEquation: 0x1801,
            depthTest: true,
          },
        });
        this.geoTextLayers.push(geoTextLayer);
      }
    }

    this.choiceProviders = [];
    this.singleProviders = [];
    this.ruralProviders = [];
    this.nonRuralProviders = [];
  }

  updateLayers() {
    this.parseProviderData();

    const ruralLayer = new ScatterplotLayer({
      id: 'rural-layer',
      data: this.ruralProviders,
      pickable: true,
      opacity: 1,
      stroked: false,
      filled: true,
      radiusScale: 1,
      radiusUnits: 'meters',
      getPosition: (d) => [Number(d['Longitude']), Number(d['Latitude']), 1000],
      getRadius: () => 96560.6,
      getFillColor: () => COLOR_RURAL,
      parameters: {
        blend: true,
        blendEquation: 0x8008,
        depthTest: true,
      },
      transitions: {
        getRadius: {
          enter: () => [0],
          easing: d3.easeCubicIn,
          duration: 10000,
        },
      },
    });

    const nonRuralLayer = new ScatterplotLayer({
      id: 'nonrural-layer',
      data: this.nonRuralProviders,
      pickable: true,
      opacity: 1,
      stroked: false,
      filled: true,
      radiusScale: 1,
      radiusUnits: 'meters',
      getPosition: (d) => [Number(d['Longitude']), Number(d['Latitude']), 2000],
      getRadius: () => 48280.3,
      getFillColor: () => COLOR_NONRURAL,
      parameters: {
        blend: true,
        blendEquation: 0x8008,
        depthTest: true,
      },
      transitions: {
        getRadius: {
          enter: () => [0],
          easing: d3.easeCubicIn,
          duration: 13000,
        },
      },
    });

    const choiceLayer = new IconLayer({
      id: 'choice-layer',
      data: this.choiceProviders,
      pickable: true,
      wrapLongitude: true,
      getPosition: (d) => [Number(d['Longitude']), Number(d['Latitude']), 3000],
      iconAtlas: 'assets/marker/location-icon-atlas.png',
      iconMapping: 'assets/marker/location-icon-mapping.json',
      getIcon: () => 'marker-choice',
      sizeScale: 15,
      parameters: {
        blend: true,
        blendEquation: 0x88e5,
        depthTest: true,
      },
    });

    const singleLayer = new IconLayer({
      id: 'single-layer',
      data: this.singleProviders,
      pickable: true,
      wrapLongitude: true,
      getPosition: (d) => [Number(d['Longitude']), Number(d['Latitude']), 3000],
      iconAtlas: 'assets/marker/location-icon-atlas.png',
      iconMapping: 'assets/marker/location-icon-mapping.json',
      getIcon: () => 'marker-single',
      sizeScale: 15,
      parameters: {
        blend: true,
        blendEquation: 0x88e5,
        depthTest: true,
      },
    });

    this.layers = [
      ...this.geoLayers,
      ruralLayer,
      nonRuralLayer,
      choiceLayer,
      singleLayer,
      ...this.geoTextLayers,
    ];
  }

  parseProviderData() {
    this.choiceProviders = this.props.ProviderData.filter((d) => d['Legend'] == 0);
    this.singleProviders = this.props.ProviderData.filter((d) => d['Legend'] == 1);
    this.ruralProviders = this.props.ProviderData.filter((d) => d['Rural'] == 0);
    this.nonRuralProviders = this.props.ProviderData.filter((d) => d['Rural'] == 1);
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.ProviderData === this.props.ProviderData &&
      prevProps.width === this.props.width &&
      prevProps.height === this.props.height
    ) {
      return;
    }

    this.setMapSize();
    this.updateLayers();
    this.setState({
      pData: this.props.ProviderData,
    });
  }

  componentDidMount() {
    this.setMapSize();
    this.updateLayers();
  }

  setMapSize() {
    const el = document.getElementsByClassName('map-page')[0];
    if (!el) return;
    const w = el.clientWidth;
    const h = el.clientHeight;

    this.setState({
      width: w,
      height: h,
    });
  }

  onViewStateChange({ viewState }) {
    this.setState({
      viewState,
    });
  }

  render() {
    if (!isMapboxConfigured()) {
      return (
        <div className="flex min-h-0 min-w-0 flex-[3] flex-col items-center justify-center rounded-2xl border border-white/60 bg-white/80 p-6 text-center text-slate-700 shadow-sm backdrop-blur">
          <p className="max-w-md text-sm leading-relaxed">
            Add <code className="rounded bg-white px-1 py-0.5 font-mono text-xs">VITE_MAPBOX_ACCESS_TOKEN</code>{' '}
            and <code className="rounded bg-white px-1 py-0.5 font-mono text-xs">VITE_MAPBOX_STYLE</code> to your{' '}
            <code className="rounded bg-white px-1 py-0.5 font-mono text-xs">.env</code> file (see{' '}
            <code className="rounded bg-white px-1 py-0.5 font-mono text-xs">.env.example</code>), then restart the
            dev server.
          </p>
          <p className="max-w-md text-xs text-slate-500">
            Production builds need the same variables in the environment (for example GitHub Actions secrets) or in a
            gitignored <code className="font-mono">.env.production.local</code> file.
          </p>
        </div>
      );
    }

    return (
      <div className="flex min-h-[420px] min-w-0 flex-[3] flex-col overflow-hidden rounded-2xl border border-white/60 bg-white/70 shadow-sm backdrop-blur">
        <div className="flex items-center justify-between border-b border-slate-200/70 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-800">Coverage View</h2>
          <span className="text-xs text-slate-500">Texas providers by specialty</span>
        </div>
        <div className="map-page relative h-full w-full">
          <div
            className="absolute isolate"
            style={{ width: this.state.width, height: this.state.height }}
          >
            <DeckGL
              layers={this.layers}
              viewState={this.state.viewState}
              controller={true}
              onViewStateChange={this.onViewStateChange.bind(this)}
            >
              <MapGL
                reuseMaps
                mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
                mapStyle={MAPBOX_STYLE}
              />
            </DeckGL>
          </div>
        </div>
      </div>
    );
  }
}

export default Map;
