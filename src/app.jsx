import { Component, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './app.css';

import Filter from './components/Filter';

import CountyData from '../assets/county.csv';
import CountyCentroidData from '../assets/counties_centroid.csv';
import ProviderData from '../assets/provider.csv';

const MapView = lazy(() => import('./components/Map'));

const ProviderLegendType = {
  Choice: 0,
  Single: 1,
};

const RuralType = {
  Rural: 0,
  NonRural: 1,
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
    const ruralByCounty = new Map();
    for (let i = 0; i < countyData.length; i++) {
      const county = countyData[i]['county'];
      if (county) {
        ruralByCounty.set(county, countyData[i]['type'] === 'Non-rural' ? RuralType.NonRural : RuralType.Rural);
      }
    }

    for (let i = 0; i < providerData.length; i++) {
      const pCounty = providerData[i]['County'];
      if (ruralByCounty.has(pCounty)) {
        providerData[i]['Rural'] = ruralByCounty.get(pCounty);
      }
    }
  }

  setLegendData(providerData) {
    const addressCounts = new Map();
    for (let i = 0; i < providerData.length; i++) {
      const address = providerData[i]['Address'];
      addressCounts.set(address, (addressCounts.get(address) ?? 0) + 1);
    }

    for (let i = 0; i < providerData.length; i++) {
      const pAddress = providerData[i]['Address'];
      providerData[i]['Legend'] =
        (addressCounts.get(pAddress) ?? 0) > 1 ? ProviderLegendType.Choice : ProviderLegendType.Single;
    }
  }

  filterDataBySpecialty(selectedSpecialties) {
    const selectedSpecialtiesSet = new Set(selectedSpecialties);
    const filteredData = ProviderData.filter((d) => selectedSpecialtiesSet.has(d['Specialty 1']));
    this.setLegendData(filteredData);

    this.pData = filteredData;

    this.setState({
      pData: this.pData,
    });
  }

  getSpecialties(providerData) {
    const specialtiesSet = new Set();
    for (let i = 0; i < providerData.length; i++) {
      const providerType = providerData[i]['Specialty 1'];
      if (providerType !== null && providerType !== undefined && providerType !== '') {
        specialtiesSet.add(providerType);
      }
    }

    return Array.from(specialtiesSet);
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
          <Suspense
            fallback={
              <div className="flex min-h-[420px] min-w-0 flex-[3] items-center justify-center rounded-2xl border border-white/60 bg-white/70 text-sm text-slate-600 shadow-sm backdrop-blur">
                Loading map...
              </div>
            }
          >
            <MapView
              CountyData={CountyData}
              CountyCentroidData={CountyCentroidData}
              ProviderData={this.pData}
              width={this.state.width}
              height={this.state.height}
            />
          </Suspense>
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
