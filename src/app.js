import React, { Component, Fragment } from 'react';
import './app.scss'
import ReactDOM from 'react-dom';
import ResizeObserver from "resize-observer-polyfill";


import Map from './components/Map';
import Filter from './components/Filter';


import CountyData from '../assets/county.csv';
import CountyCentroidData from '../assets/counties_centroid.csv';
import ProviderData from '../assets/provider.csv';

const ProviderLegendType = {
  Choice: 0,
  Single: 1,
}

const RuralType = {
  Rural: 0,
  NonRural: 1
}

const isExistValueInArray = (array, value) => {
  let isExistValue = false;
  for (let i in array) {
    if (array[i] == value) {
      isExistValue = true
    }
  }
  return isExistValue
}

export default class App extends Component {

  constructor(props) {
    super(props);

    //bind
    this.filterDataBySpecialty = this.filterDataBySpecialty.bind(this);

    this.pData = ProviderData;

    //Add Rural
    this.setRuralData(this.pData, CountyData);

    //Get specialties
    this.specialties = this.getSpecialties(this.pData);

    //Add legend data
    this.setLegendData(this.pData);

    this.state = {
      width: 0,
      height: 0,
      pData: this.pData
    };

  }

  setRuralData(providerData, countyData) {
    //Add Rural State
    for (let i = 0; i < providerData.length; i++) {
      let pData = providerData[i];
      let pCounty = pData["County"];

      let filteredData = countyData.filter(d => d["county"] == pCounty);
      if (filteredData.length > 0) {
        providerData[i]["Rural"] = filteredData[0]["type"] === "Non-rural" ? RuralType.NonRural : RuralType.Rural;
      }
    }
  }

  setLegendData(providerData) {
    for (let i = 0; i < providerData.length; i++) {
      let pData = providerData[i];
      let pAddress = pData["Address"];

      let filteredData = providerData.filter(d => d["Address"] == pAddress);
      if (filteredData.length > 1) {
        //Choice
        providerData[i]["Legend"] = ProviderLegendType.Choice
      }
      else {
        //Single
        providerData[i]["Legend"] = ProviderLegendType.Single
      }


    }
  }

  filterDataBySpecialty(selectedSpecialties) {
    let filteredData = ProviderData.filter(d => isExistValueInArray(selectedSpecialties, d["Specialty 1"]))
    this.setLegendData(filteredData);


    this.pData = filteredData;
    
    this.setState({
      pData: this.pData
    })
  }

  getSpecialties(providerData) {
    const providerJson = {};
    for (let i = 0; i < providerData.length; i++) {
      let pData = providerData[i];
      const providerType = pData["Specialty 1"];
      if (providerType !== null) {
        if (providerType in providerJson) {
          providerJson[providerType].data.push(pData);
        }
        else {
          //Create new provider type
          providerJson[providerType] = {
            data: [pData]
          }
        }
      }
    }

    let specialties = [];
    Object.keys(providerJson).forEach(key => {
      specialties.push(key);
    })

    return specialties;
  }

  componentDidMount() {
    this.resizeObserver = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;

      this.setState({
        width: Math.floor(width),
        height: Math.floor(height)
      });

    });

    this.resizeObserver.observe(document.getElementById('app'));
  }

  componentWillUnmount() {
    this.resizeObserver.disconnect();
  }


  render() {
    return (
      <div className="root">
        <Map CountyData={CountyData} CountyCentroidData={CountyCentroidData} ProviderData={this.pData} width={this.state.width} height={this.state.height}></Map>
        <Filter Specialties={this.specialties} changeSpecialty={this.filterDataBySpecialty}></Filter>
      </div >
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#app'));