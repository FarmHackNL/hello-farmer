import $ from 'jquery';
import L from 'leaflet';
import loadanim from './loadanim';
import getIcon from './icon';
import geojson from '../vechtdal.geojson';

const startPosition = [52.5124179,6.0922516, 13];  // Zwolle centrum
const endPosition   = [52.5166077, 6.1483097, 16]; // Stadslanderijen

const map = L.map('app').setView([startPosition[0], startPosition[1]], startPosition[2]);

const layers = [
  // land boundaries
  L.geoJson(geojson, {
    onEachFeature: (feature, layer) => {
      const _popupData = popupData(feature);
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
layers.map((layer) => layer.addTo(map));

loadanim(map, endPosition, layers);

function popupData(feature) {
  const props = feature.properties;
  let items = [];
  items.push([`
    <h2 class="pre-title">${props.producer || 'Vechtdal Boer'}</h2>
    <h1>${props.name}</h1>
  `, false]);
  if (props.vr_url) {
    items.push([
      `<iframe width="100%" height="300px" allowfullscreen frameborder="0" src="//storage.googleapis.com/vrview/index.html?image=${encodeURIComponent(props.vr_url)}&is_stereo=true"></iframe>`
    , false]);
  } else if (props.image_urls) {
    items.push([
      `<div class="text-center"><img src="${props.image_urls[0]}"></div>`
    , false])
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

// easter egg
$('#logo').on('click', () => {
  alert('Hallo bezoeker!')
});

$('#search').on('click', () => {
  alert('Sorry, je kunt nog niet zoeken.');
});
