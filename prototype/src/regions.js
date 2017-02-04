
export const regions = {
  vechtdal: {
    id: 'vechtdal',
    position: [52.5267896,6.3374302, 16],     // Tuinderij Ernie van der Kolk
    loadPosition: [52.504323,6.2693792, 13],  // Near Dalfsen
    loadTitle: 'Het Vechtdal',
    producerPlaceholder: 'Vechtdal boer',
    geojson: {
      lands: require('../vechtdal.lands.geojson'),
    },
    data: {
      places: require('dsv!../vechtdal.places.csv'),
      products: require('dsv!../vechtdal.products.csv'),
    }
  },
  zwolle: {
    id: 'zwolle',
    position: [52.5166077, 6.1483097, 16],    // Stadslanderijen
    loadPosition: [52.5124179,6.0922516, 13], // Zwolle centre
    loadTitle: 'Zwolle',
    producerPlaceholder: 'Stadslanderij boer',
    geojson: {
      lands: require('../zwolle.lands.geojson'),
    },
    data: {
      places: [],
      products: [],
    }
  },
};

// allow to select region by hashtag
export const regionId = location.hash.substr(1); // strip first '#' character
export const region = regions[regionId] || regions.vechtdal;

export default {region, regionId, regions};
