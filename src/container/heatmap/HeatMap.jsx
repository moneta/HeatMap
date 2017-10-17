import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getLatLngRange, arrayGenerator } from '../../common/utils/util';
import { fetchPolygon, getIncome, updateIncome } from  '../../redux/modules/domain/income';

const mapStateToProps = (state, ownProps) => ({
  zoom: state.heat.zoom,
  center: state.heat.center,
  polygon: state.income.polygon,
  medianIncome: state.income.medianIncome,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  updateIncome: (data) => {
    dispatch(updateIncome(data));
  },
  fetchPolygon: (callback) => {
    dispatch(fetchPolygon({ callback }));
  },
});

@connect(mapStateToProps, mapDispatchToProps)
export default class HeatMap extends Component {
  componentDidMount() {
    this.loadMap(true);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.google !== this.props.google) {
      this.loadMap(true);
    }

    if (prevProps.medianIncome !== this.props.medianIncome) {
      if (this.map) {
        this.showHeatMap(this.map, this.props.medianIncome);
      }
    }

    if (prevProps.polygon !== this.props.polygon) {
      if (this.map) {
        this.showPolygon(this.map, this.props.polygon);
      }
    }
  }

  handleEvent(e) {
    console.log(e.latLng.lat(), e.latLng.lng());
  }

  loadMap(firstLoad) {
    if (this.props && this.props.google) {
      // google is available
      const { google, zoom, center, polygon, medianIncome } = this.props;
      const maps = google.maps;

      const mapRef = this.refs.map;
      const node = ReactDOM.findDOMNode(mapRef);

      const mapConfig = Object.assign({}, {
        center: new maps.LatLng(center.lat, center.lng),
        zoom,
      })
      this.map = new maps.Map(node, mapConfig);

      const evtNames = ['click'];
      evtNames.forEach(e => {
        this.map.addListener(e, this.handleEvent);
      });

      this.showPolygon(this.map, polygon);

      this.showHeatMap(this.map, medianIncome);

      if (firstLoad) {
        this.props.fetchPolygon(()=> {
          setTimeout(() => {
            this.updateIncome(maps);
          }, 0);
        });
      }
    }
  }

  showHeatMap = (map, medianIncome) => {
    const maps = this.props.google.maps;
    const heatMapData = medianIncome.map((data) => ({
      location: new maps.LatLng(data.location.lat, data.location.lng),
      weight: data.weight,
    }));

    if (heatMapData.length > 0) {
      this.heatmap = new maps.visualization.HeatmapLayer({
        data: heatMapData,
      });

      this.heatmap.setMap(map);
    }
  }

  showPolygon = (map, polygon) => {
    const maps = this.props.google.maps;
    this.poly = new maps.Polygon({
      paths: polygon,
      strokeColor: '#FF0000',
      strokeWeight: 2,
      fillOpacity: 0
    });

    this.poly.setMap(this.map);
  }

  updateIncome = (maps) => {
    const { polygon } = this.props;
    const step = 25;
    const range = {
      lat: getLatLngRange(polygon, 'lat'),
      lng: getLatLngRange(polygon, 'lng'),
    };
    const tasks = [];
    const inputs = [];

    arrayGenerator(step).forEach((i) => {
      const lat = range.lat.min + i * (range.lat.max - range.lat.min ) / (step - 1);
      arrayGenerator(step).forEach((j) => {
        const lng = range.lng.min + j * (range.lng.max - range.lng.min ) / (step - 1);
        const coordinate = new maps.LatLng(lat, lng);
        if (maps.geometry.poly.containsLocation(coordinate, this.poly)) {
          tasks.push(getIncome({ lat, lng }));
          inputs.push({ lat, lng });
        }
      });
    });

    Promise.all(tasks).then(
      responses => {
        const data = responses.map((response, idx) => ({
          location: inputs[idx],
          weight: response.Results.medianIncome,
        }));

        this.props.updateIncome(data);
      },
      reason => {
        console.log(reason);
      });
  }

  toggleHeatmap = () => {
    const heatmap = this.heatmap;
    heatmap.setMap(heatmap.getMap() ? null : this.map);
  }

  changeGradient = () => {
    const heatmap = this.heatmap;
    const gradient = [
      'rgba(0, 255, 255, 0)',
      'rgba(0, 255, 255, 1)',
      'rgba(0, 191, 255, 1)',
      'rgba(0, 127, 255, 1)',
      'rgba(0, 63, 255, 1)',
      'rgba(0, 0, 255, 1)',
      'rgba(0, 0, 223, 1)',
      'rgba(0, 0, 191, 1)',
      'rgba(0, 0, 159, 1)',
      'rgba(0, 0, 127, 1)',
      'rgba(63, 0, 91, 1)',
      'rgba(127, 0, 63, 1)',
      'rgba(191, 0, 31, 1)',
      'rgba(255, 0, 0, 1)'
    ]
    heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
  }

  changeRadius = () => {
    const heatmap = this.heatmap;
    heatmap.set('radius', heatmap.get('radius') ? null : 20);
  }

  changeOpacity = () => {
    const heatmap = this.heatmap;
    heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
  }

  render() {
    const { width, height } = this.props;
    const style = {
      width,
      height,
    };
    const floatingPanelStyle = {
      position: 'absolute',
      top: 10,
      height: 20,
      left: '25%',
      zIndex: 5,
      backgroundColor: 'transparent',
      padding: 5,
      border: '1px solid #999',
      textAlign: 'center',
      fontFamily: '"Roboto","sans-serif"',
      lineHeight: 30,
      paddingLeft: 10,
      display: 'flex',
    }

    return (
      <div style={style}>
        <div style={floatingPanelStyle}>
          <button onClick={this.toggleHeatmap}>Toggle Heatmap</button>
          <button onClick={this.changeGradient}>Change gradient</button>
          <button onClick={this.changeRadius}>Change radius</button>
          <button onClick={this.changeOpacity}>Change opacity</button>
        </div>
        <div
          style={style}
          ref='map'
        />
      </div>
    )
  }
}

HeatMap.defaultProps = {
  zoom: 1,
  center: {
    lat: 37.774929,
    lng: -122.419416
  },
  medianIncome: [],
};

HeatMap.propTypes = {
  google: PropTypes.object,
  zoom: PropTypes.number,
  center: PropTypes.object,
  polygon: PropTypes.object,
  medianIncome: PropTypes.array,
};