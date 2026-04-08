import { Component } from 'react';
import { createRoot } from 'react-dom/client';
import './app.css';

import Map from './components/Map';
import Filter from './components/Filter';

import CountyData from '../assets/county.csv';
import CountyCentroidData from '../assets/counties_centroid.csv';
import ProviderData from '../assets/provider.csv';

const ProviderLegendType = {
  Choice: 0,
  Single: 1,
};

const RuralType = {
  Rural: 0,
  NonRural: 1,
};

const isExistValueInArray = (array, value) => {
  let isExistValue = false;
  for (const i in array) {
    if (array[i] == value) {
      isExistValue = true;
    }
  }
  return isExistValue;
};

export default class App extends Component {
  constructor(props) {
    super(props);

    this.filterDataBySpecialty = this.filterDataBySpecialty.bind(this);

    this.pData = ProviderData;

    this.setRuralData(this.pData, CountyData);

    this.specialties = this.getSpecialties(this.pData);

    this.setLegendData(this.pData);

    this.state = {
      width: 0,
      height: 0,
      pData: this.pData,
    };
  }

  setRuralData(providerData, countyData) {
    for (let i = 0; i < providerData.length; i++) {
      const pData = providerData[i];
      const pCounty = pData['County'];

      const filteredData = countyData.filter((d) => d['county'] == pCounty);
      if (filteredData.length > 0) {
        providerData[i]['Rural'] =
          filteredData[0]['type'] === 'Non-rural' ? RuralType.NonRural : RuralType.Rural;
      }
    }
  }

  setLegendData(providerData) {
    for (let i = 0; i < providerData.length; i++) {
      const pData = providerData[i];
      const pAddress = pData['Address'];

      const filteredData = providerData.filter((d) => d['Address'] == pAddress);
      if (filteredData.length > 1) {
        providerData[i]['Legend'] = ProviderLegendType.Choice;
      } else {
        providerData[i]['Legend'] = ProviderLegendType.Single;
      }
    }
  }

  filterDataBySpecialty(selectedSpecialties) {
    const filteredData = ProviderData.filter((d) =>
      isExistValueInArray(selectedSpecialties, d['Specialty 1']),
    );
    this.setLegendData(filteredData);

    this.pData = filteredData;

    this.setState({
      pData: this.pData,
    });
  }

  getSpecialties(providerData) {
    const providerJson = {};
    for (let i = 0; i < providerData.length; i++) {
      const pData = providerData[i];
      const providerType = pData['Specialty 1'];
      if (providerType !== null) {
        if (providerType in providerJson) {
          providerJson[providerType].data.push(pData);
        } else {
          providerJson[providerType] = {
            data: [pData],
          };
        }
      }
    }

    const specialties = [];
    Object.keys(providerJson).forEach((key) => {
      specialties.push(key);
    });

    return specialties;
  }

  componentDidMount() {
    this.resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;

      this.setState({
        width: Math.floor(width),
        height: Math.floor(height),
      });
    });

    this.resizeObserver.observe(document.getElementById('app'));
  }

  componentWillUnmount() {
    this.resizeObserver.disconnect();
  }

  render() {
    return (
      <div className="root flex min-h-screen w-full flex-col p-3 md:p-4 min-[1281px]:h-screen min-[1281px]:overflow-hidden">
        <header className="mb-3 rounded-2xl border border-white/60 bg-white/70 px-4 py-3 shadow-sm backdrop-blur md:mb-4 md:px-5">
          <h1 className="text-base font-semibold tracking-tight text-slate-900 md:text-lg">Medical Coverage Map</h1>
          <p className="mt-1 text-xs text-slate-600 md:text-sm">
            Explore treating providers by specialty with county-level context.
          </p>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-3 min-[1281px]:flex-row min-[1281px]:gap-4">
          <Map
            CountyData={CountyData}
            CountyCentroidData={CountyCentroidData}
            ProviderData={this.pData}
            width={this.state.width}
            height={this.state.height}
          />
          <Filter
            Specialties={this.specialties}
            changeSpecialty={this.filterDataBySpecialty}
            totalProviders={ProviderData.length}
            visibleProviders={this.pData.length}
          />
        </div>
      </div>
    );
  }
}

const rootEl = document.querySelector('#app');
createRoot(rootEl).render(<App />);
