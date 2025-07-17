import React, { Component } from 'react';
import './Map.scss';

import { StaticMap } from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import { ArcLayer, ScatterplotLayer, GeoJsonLayer, TextLayer, IconLayer } from '@deck.gl/layers';
import * as d3 from 'd3';


const MAPBOX_TOKEN = process.env.MapboxAccessToken;

const MAP_STYLE = process.env.MapboxStyle;

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
                longitude: -99.901810,
                zoom: 5.5,
                maxZoom: 16,
                pitch: 10,
                bearing: 0
            },
            width: 0,
            height: 0,
            pData: this.props.ProviderData
        }

        this.layers = [];

        /**
         * County 
         */
        this.geoLayers = [];
        this.geoTextLayers = [];
        for (let i = 0; i < this.props.CountyData.length; i++) {
            //GeoJson layer
            let county = this.props.CountyData[i].county;
            let geoData = "https://raw.githubusercontent.com/belopot/medmaps/master/assets/geojson/TX/" + county + ".geo.json";
            let geoLayer = new GeoJsonLayer({
                id: "geo_" + county,
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
                        enter: value => [COLOR_GEO_FILL[0], COLOR_GEO_FILL[1], COLOR_GEO_FILL[2], 0] // fade in
                    },
                    getLineColor: {
                        duration: 5000,
                        easing: d3.easeCubicInOut,
                        enter: value => [COLOR_GEO_EDGE[0], COLOR_GEO_EDGE[1], COLOR_GEO_EDGE[2], 0] // fade in
                    }
                }
            })
            this.geoLayers.push(geoLayer);

            //GeoText layer

            let d = this.props.CountyCentroidData.filter(d => d.county == county);
            if (d.length > 0) {
                let geoTextLayer = new TextLayer({
                    id: "geotext_" + county,
                    data: d,
                    getText: d => d.county,
                    getPosition: d => [Number(d.longitude), Number(d.latitude), 5000],
                    getColor: d => COLOR_GEO_TEXT,
                    sizeUnits: 'meters',
                    getSize: d => 10000,
                    sizeScale: 1,
                    parameters: {
                        blend: true,
                        blendEquation: 0x1801, //DEPTH
                        depthTest: true
                    },
                })
                this.geoTextLayers.push(geoTextLayer);
            }
        }

        /**
         * Provider
         */
        this.choiceProviders = [];
        this.singleProviders = [];
        this.ruralProviders = [];
        this.nonRuralProviders = [];



    }

    updateLayers() {

        //parse providers
        this.parseProviderData();

        //create provider layer
        ///Rural layer
        let ruralLayer = new ScatterplotLayer({
            id: 'rural-layer',
            data: this.ruralProviders,
            pickable: true,
            opacity: 1,
            stroked: false,
            filled: true,
            radiusScale: 1,
            radiusUnits: 'meters',
            getPosition: d => [Number(d["Longitude"]), Number(d["Latitude"]), 1000],
            getRadius: d => 96560.6,
            getFillColor: d => COLOR_RURAL,
            parameters: {
                blend: true,
                blendEquation: 0x8008, //MAX
                depthTest: true
            },
            transitions: {
                getRadius: {
                    enter: _ => [0], // grow from size 0,
                    easing: d3.easeCubicIn,
                    duration: 10000
                }
            }
        })

        ///NonRural layer
        let nonRuralLayer = new ScatterplotLayer({
            id: 'nonrural-layer',
            data: this.nonRuralProviders,
            pickable: true,
            opacity: 1,
            stroked: false,
            filled: true,
            radiusScale: 1,
            radiusUnits: 'meters',
            getPosition: d => [Number(d["Longitude"]), Number(d["Latitude"]), 2000],
            getRadius: d => 48280.3,
            getFillColor: d => COLOR_NONRURAL,
            parameters: {
                blend: true,
                blendEquation: 0x8008, //MAX
                depthTest: true
            },
            transitions: {
                getRadius: {
                    enter: _ => [0], // grow from size 0,
                    easing: d3.easeCubicIn,
                    duration: 13000
                }
            }
        })



        ///Choice layer
        let choiceLayer = new IconLayer({
            id: "choice-layer",
            data: this.choiceProviders,
            pickable: true,
            wrapLongitude: true,
            getPosition: d => [Number(d["Longitude"]), Number(d["Latitude"]), 3000],
            iconAtlas: 'assets/marker/location-icon-atlas.png',
            iconMapping: 'assets/marker/location-icon-mapping.json',
            getIcon: d => 'marker-choice',
            sizeScale: 15,
            parameters: {
                blend: true,
                blendEquation: 0x88e5, //STATIC_READ
                depthTest: true
            },
        })


        ///Single layer
        let singleLayer = new IconLayer({
            id: "single-layer",
            data: this.singleProviders,
            pickable: true,
            wrapLongitude: true,
            getPosition: d => [Number(d["Longitude"]), Number(d["Latitude"]), 3000],
            iconAtlas: 'assets/marker/location-icon-atlas.png',
            iconMapping: 'assets/marker/location-icon-mapping.json',
            getIcon: d => 'marker-single',
            sizeScale: 15,
            parameters: {
                blend: true,
                blendEquation: 0x88e5, //STATIC_READ
                depthTest: true
            },
        })

        this.layers = [];
        this.layers.push(this.geoLayers);
        this.layers.push(ruralLayer)
        this.layers.push(nonRuralLayer)
        this.layers.push(choiceLayer);
        this.layers.push(singleLayer);
        this.layers.push(this.geoTextLayers);
    }

    parseProviderData() {
        //Get Choice providers
        this.choiceProviders = this.props.ProviderData.filter(d => d["Legend"] == 0);
        //Get Single providers
        this.singleProviders = this.props.ProviderData.filter(d => d["Legend"] == 1);
        //Get rural providers
        this.ruralProviders = this.props.ProviderData.filter(d => d["Rural"] == 0);
        //Get nonrural providers
        this.nonRuralProviders = this.props.ProviderData.filter(d => d["Rural"] == 1);
    }



    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setMapSize();

            this.updateLayers();

            this.setState({
                pData: this.props.ProviderData
            })

        }
    }

    componentDidMount() {
        this.setMapSize();
        this.updateLayers();
    }

    setMapSize() {
        let w = document.getElementsByClassName("map-page")[0].clientWidth;
        let h = document.getElementsByClassName("map-page")[0].clientHeight;

        this.setState({
            width: w,
            height: h
        })
    }

    onViewStateChange({ viewState }) {
        this.setState({
            viewState
        });
    }

    render() {


        return (
            <div className="map-root">
                <div className="map-page">
                    <div className="map" style={{ width: this.state.width, height: this.state.height }}>
                        <DeckGL
                            layers={this.layers}
                            viewState={this.state.viewState}
                            controller={true}
                            onViewStateChange={this.onViewStateChange.bind(this)}
                        >
                            <StaticMap
                                reuseMaps
                                mapStyle={MAP_STYLE}
                                preventStyleDiffing={true}
                                mapboxApiAccessToken={MAPBOX_TOKEN}
                            />
                        </DeckGL>
                    </div>
                </div>
            </div>

        );
    }
}

export default Map;