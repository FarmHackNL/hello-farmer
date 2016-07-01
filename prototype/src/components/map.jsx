import React, {PropTypes} from 'react';
import {Map, Marker, Popup, TileLayer} from 'react-leaflet';

class HelloMap extends React.Component {
  render() {
    const {position, zoom} = this.props;

    return (
      <Map center={position} zoom={zoom} style={styles.map}>
        <TileLayer url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />
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
    height: 450,
  },
}

export default HelloMap;
