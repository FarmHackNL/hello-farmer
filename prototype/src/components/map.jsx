import React, {PropTypes} from 'react';
import {GeoJson, Map, Marker, Popup, TileLayer} from 'react-leaflet';

import geojson from '../../vechtdal.geojson';

class HelloMap extends React.Component {
  render() {
    const {position, zoom} = this.props;

    return (
      <Map center={position} zoom={zoom} style={styles.map}>
        <TileLayer url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />
        <GeoJson data={geojson} />
        <Marker position={position}>
          <Popup>
            <span>A pretty CSS3 popup.<br/>Easily customizable.</span>
          </Popup>
        </Marker>
      </Map>
    );
  }

};

HelloMap.defaultProps = {
  position: [52.5146968, 6.0448244], // Zwolle
  zoom: 12,
};

HelloMap.propTypes = {
  position: PropTypes.array.isRequired,
  zoom: PropTypes.number.isRequired,
};

const styles = {
  map: {
    height: '100%',
  },
}

export default HelloMap;
