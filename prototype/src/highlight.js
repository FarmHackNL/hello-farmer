import $ from 'jquery';
import {region} from './regions';
import {infoPlace, infoLand} from './info';

export function highlightPlace(layers, markers, place) {
  // gather places and lands that are related to this place
  let related_place_ids = [];
  let related_land_ids = [];
  if (place) {
    // add the place itself
    related_place_ids.push(parseInt(place.id));
    region.data.products.forEach(product => {
      // add retailers and lands of products by this place
      if (product.producer_ids.split(/\s*,\s*/).includes(String(place.id))) {
        related_place_ids.push(...product.retailer_ids.split(/\s*,\s*/).map(parseInt));
        related_land_ids.push(...product.land_ids.split(/\s*,\s*/).map(parseInt));
      }
      // if retailer, add producers and lands it's selling
      if (product.retailer_ids.split(/\s*,\s*/).includes(String(place.id))) {
        related_place_ids.push(...product.producer_ids.split(/\s*,\s*/).map(parseInt));
        related_land_ids.push(...product.land_ids.split(/\s*,\s*/).map(parseInt));
      }
    });
    // add lands managed by this place
    region.geojson.lands.features.forEach(feature => {
      const land = feature.properties;
      if (land.producer_id == place.id) related_land_ids.push(parseInt(land.id));
    });
  }
  // and update status of map objects
  markers.places.forEach((marker, i) => {
    const highlight = !place || related_place_ids.includes(i);
    marker.setOpacity(highlight ? 1 : 0.3);
  });
  markers.lands.forEach((marker, i) => {
    const highlight = !place || related_land_ids.includes(i);
    marker.setOpacity(highlight ? 1 : 0.3);
  });
  layers[1].eachLayer(layer => {
    const highlight = !place || related_land_ids.includes(parseInt(layer.feature.properties.id));
    layer.getElement().style.opacity = highlight ? 1 : 0.3;
  });
  // then show info box
  if (place) {
    $('#info').html(infoPlace(place)).stop().fadeIn();
  } else {
    $('#info').stop().fadeOut();
  }
}

export function highlightLand(layers, markers, land) {
  // gather places that are related to this land
  let related_place_ids = [];

  if (land) {
    // add producer
    if (land.producer_id) related_place_ids.push(parseInt(land.producer_id));
    region.data.products.forEach(product => {
      // if product references this, add retailer
      if (product.land_ids.split(/\s*,\s*/).includes(String(land.id))) {
        related_place_ids.push(...product.retailer_ids.split(/\s*,\s*/).map(parseInt));
      }
    });
  }

  // and update status of map objects
  markers.places.forEach((marker, i) => {
    const highlight = !land || related_place_ids.includes(i);
    marker.setOpacity(highlight ? 1 : 0.3);
  });
  markers.lands.forEach((marker, i) => {
    const highlight = !land || i === parseInt(land.id);
    marker.setOpacity(highlight ? 1 : 0.3);
  });
  layers[1].eachLayer(layer => {
    const highlight = !land || parseInt(land.id) === parseInt(layer.feature.properties.id);
    layer.getElement().style.opacity = highlight ? 1 : 0.3;
  });
    // then show info box
  if (land) {
    $('#info').html(infoLand(land)).stop().fadeIn();
  } else {
    $('#info').stop().fadeOut();
  }
}

export default {highlightLand, highlightPlace};
