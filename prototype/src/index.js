import $ from 'jquery';
import L from 'leaflet';
import {debounce} from 'lodash';
import loadanim from './loadanim';
import {getIcon} from './icon';
import regions from './regions';
import search from './search';

// allow to select region by hashtag
const regionId = location.hash.substr(1); // strip first '#' character
const region = regions[regionId] || regions.vechtdal;

const map = L.map('app').setView([region.loadPosition[0], region.loadPosition[1]], region.loadPosition[2]);
$('#intro-text').text(region.loadTitle);

// marker objects on map for showing/hiding
const map_objs = {
  places: {markers: []},
  lands: {markers: [], boundaries: []},
};

const layers = [
  // places
  L.featureGroup(region.data.places.map(place => {
    const icon = getIcon(place.type) || getIcon('place-default');
    const _popupData = placePopupData(place);
    const marker = L.marker([place.lat, place.lon], {icon: icon}).bindPopup(_popupData, {minWidth: 250, maxWidth: 380});
    marker.on('mouseover', () => { highlightPlace(place); });
    marker.on('mouseout', () => { highlightPlace(); });
    map_objs.places.markers[place.id] = marker;
    return marker;
  })),
  // land boundaries
  L.geoJson(region.geojson.lands, {
    onEachFeature: (feature, layer) => {
      const _popupData = landPopupData(feature.properties);
      const bindPopup = (el) => el.bindPopup(_popupData, {minWidth: 250, maxWidth: 380});
      // add popup
      bindPopup(layer);
      // add marker
      if (feature.geometry && feature.geometry.type === 'Polygon') {
        const geom = L.polygon(feature.geometry.coordinates[0].map(a => L.latLng([a[1], a[0]])));
        const pos = geom.getBounds().getCenter();
        const icon = getIcon(feature.properties.produce_id) || getIcon(feature.properties.crop_id);
        if (icon) {
          const marker = L.marker(pos, {icon: icon});
          bindPopup(marker).addTo(map);
          marker.on('mouseover', () => { highlightLand(feature.properties); });
          marker.on('mouseout', () => { highlightLand(); });
          map_objs.lands.markers[feature.properties.id] = marker;
        }
      }
      map_objs.lands.boundaries[feature.properties.id] = layer;
    }
  }),
  // OSM tiles
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }),
  /*L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
  }),*/
];

loadanim(map, region.position, layers);
layers.map((layer) => layer.addTo(map));

function landPopupData(props) {
  let items = [];
  items.push([`
    <h2 class="pre-title">${props.producer || region.producerPlaceholder}</h2>
    <h1>${props.name || props.crop_name}</h1>
  `, false]);
  if (props.vr_url) {
    items.push([
      `<iframe width="100%" height="300px" allowfullscreen frameborder="0" src="//storage.googleapis.com/vrview/index.html?image=${encodeURIComponent(props.vr_url)}&is_stereo=true"></iframe>`
    , false]);
  } else if (props.image_urls) {
    items.push([
      `<div class="text-center"><img src="${props.image_urls[0]}"></div>`
    , false])
  } else if (props.image_url) {
    items.push([
      `<div class="text-center"><img src="${props.image_url}"></div>`
    , false]);
  }
  props.description && items.push([props.description, false]);
  if (props.sowingDate) {
    items.push([
      `<em>Gezaaid</em> ${props.sowingDate}` + (props.harvestDate ? `, <em>oogst</em> ${props.harvestDate}` : '')
    , false]);
  }
  props.website && items.push(['Lees meer over de boer <i class="glyphicon glyphicon-chevron-right pull-right" style="margin-top: 3px"></i>', `http://${props.website}/`])
  return '<div class="listgroup map-popup">' + items.map(i => `<${i[1] ? `a href='${i[1]}'` : 'div'} class="list-group-item">${i[0]}</${i[1] ? 'a' : 'div'}>`).join('') + '</div>';
}

function placePopupData(feature) {
  return landPopupData(feature);
}

function highlightPlace(place) {
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
  map_objs.places.markers.forEach((marker, i) => {
    const highlight = !place || related_place_ids.includes(i);
    marker.setOpacity(highlight ? 1 : 0.3);
  });
  map_objs.lands.markers.forEach((marker, i) => {
    const highlight = !place || related_land_ids.includes(i);
    marker.setOpacity(highlight ? 1 : 0.3);
  });
  map_objs.lands.boundaries.forEach((boundary, i) => {
    const highlight = !place || related_land_ids.includes(i);
    //boundary.setOpacity(highlight ? 1 : 0.3);
  });
}

function highlightLand(land) {
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
  map_objs.places.markers.forEach((marker, i) => {
    const highlight = !land || related_place_ids.includes(i);
    marker.setOpacity(highlight ? 1 : 0.3);
  });
  map_objs.lands.markers.forEach((marker, i) => {
    const highlight = !land || i === parseInt(land.id);
    marker.setOpacity(highlight ? 1 : 0.3);
  });
  map_objs.lands.boundaries.forEach((boundary, i) => {
    const highlight = !land || i === parseInt(land.id);
    //boundary.setOpacity(highlight ? 1 : 0.3);
  });
}

// easter egg
$('#logo').on('click', function() {
  alert('Hallo bezoeker!')
});

// searching
$('#search input').on('keyup change', debounce(function(e) {
  if (e.keyCode == 27) $(this).val(''); // esc clears
  let val = $(this).val();
  if (val.trim() != '') {
    search.open();
    search.search(region, val);
  } else {
    search.close();
  }
}, 100));
