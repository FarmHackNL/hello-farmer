import $ from 'jquery';
import L from 'leaflet';
import {debounce} from 'lodash';
import loadanim from './loadanim';
import {getIcon} from './icon';
import regions from './regions';
import search from './search';

// allow to select region by hashtag
const regionId = location.hash.substr(1); // strip first '#' character
const region = regions[regionId] || regions.zwolle;

const map = L.map('app').setView([region.loadPosition[0], region.loadPosition[1]], region.loadPosition[2]);
$('#intro-text').text(region.loadTitle);

const layers = [
  // places
  L.geoJson(region.geojson.places, {
    onEachFeature: (feature, layer) => {
      const _popupData = placePopupData(feature);
      const bindPopup = (el) => el.bindPopup(_popupData, {minWidth: 250, maxWidth: 380});
      // add popup
      bindPopup(layer);
      // add marker
      if (feature.geometry && feature.geometry.type === 'Point') {
        const pos = feature.geometry.coordinates;
        const icon = getIcon(feature.properties.type) || getIcon(feature.properties.crop_id);
        icon && bindPopup(L.marker(pos, {icon: icon})).addTo(map);
      };
    }
  }),
  // land boundaries
  L.geoJson(region.geojson.lands, {
    onEachFeature: (feature, layer) => {
      const _popupData = landPopupData(feature);
      const bindPopup = (el) => el.bindPopup(_popupData, {minWidth: 250, maxWidth: 380});
      // add popup
      bindPopup(layer);
      // add marker
      if (feature.geometry && feature.geometry.type === 'Polygon') {
        const geom = L.polygon(feature.geometry.coordinates[0].map(a => L.latLng([a[1], a[0]])));
        const pos = geom.getBounds().getCenter();
        const icon = getIcon(feature.properties.produce_id) || getIcon(feature.properties.crop_id);
        icon && bindPopup(L.marker(pos, {icon: icon})).addTo(map);
      };
    }
  }),
  // OSM tiles
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }),
];

loadanim(map, region.position, layers);
layers.map((layer) => layer.addTo(map));

function landPopupData(feature) {
  const props = feature.properties;
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
  props.info_url && items.push(['Lees meer over de boer <i class="glyphicon glyphicon-chevron-right pull-right" style="margin-top: 3px"></i>', props.info_url])
  return '<div class="listgroup map-popup">' + items.map(i => `<${i[1] ? `a href='${i[1]}'` : 'div'} class="list-group-item">${i[0]}</${i[1] ? 'a' : 'div'}>`).join('') + '</div>';
}

function placePopupData(feature) {
  return landPopupData(feature);
}

// easter egg
$('#logo').on('click', function() {
  alert('Hallo bezoeker!')
});

// searching
$('#search input').on('keyup change', debounce(function() {
  let val = $(this).val();
  if (val.trim() != '') {
    search.open();
    search.search(region, val);
  } else {
    search.close();
  }
}, 100));
