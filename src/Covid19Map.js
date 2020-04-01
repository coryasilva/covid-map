import React from 'react';
import L from 'leaflet';
import { Map, TileLayer, GeoJSON } from 'react-leaflet';
import { formatRelative } from 'date-fns';
import hash from 'object-hash';
import CovidService from './CovidService';
import * as geostats from 'geostats';
import '../node_modules/leaflet/dist/leaflet.css';
import './Covid19Map.css';

// Hospitals
// https://services1.arcgis.com/Hp6G80Pky0om7QvQ/arcgis/rest/services/Hospitals_1/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json

const StatService = new geostats([]);

class Covid19Map extends React.Component {
  constructor() {
    super();
    this.state = {
      lat: 36, //32.85
      lng: -100, //-117
      zoom: 4, //6
      breaks: 9,
      cases: []
    };
  }

  async componentDidMount() {
    const cases = await CovidService.get();
    StatService.setSerie(cases.features.map(f => f.properties.Confirmed));
    StatService.getClassJenks2(this.state.breaks);
    this.setState({ cases });
  }

  caseStyle(feature, latlng) {
    var jenksClass = StatService.getRangeNum(feature.properties.Confirmed)
    return L.circleMarker(latlng, {
      radius: 10 * (jenksClass + 1),
      fillColor: '#ff7800',
      color: '#fff',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    });
  }

  onEachCase(feature, layer) {
    const data = `
      <h2>${feature.properties.Province_State}, <small>${feature.properties.Country_Region}</small></h2>
      <label>Confirmed: </label><strong>${feature.properties.Confirmed}</strong><br>
      <label>Recovered: </label><strong>${feature.properties.Recovered}</strong><br>
      <label>Deaths: </label><strong>${feature.properties.Deaths}</strong><br>
      <small>Last updated <strong>${formatRelative(new Date(feature.properties.Last_Update), new Date())}</strong></small>
    `;
    const popupContent = `<Popup><p>${data}</p></Popup>`;
    layer.bindPopup(popupContent);
  }

  render() {
    const position = [this.state.lat, this.state.lng];
    return (
      <Map id="covid-19-map" center={position} zoom={this.state.zoom}>
        <TileLayer
          attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}"
          subdomains="abcd"
          minZoom={2}
          maxZoom={20}
          ext="png"
        />
        <GeoJSON
          key={hash(this.state.cases)}
          data={this.state.cases}
          pointToLayer={this.caseStyle}
          onEachFeature={this.onEachCase}
        />
      </Map>
    );
  };
}

export default Covid19Map;
