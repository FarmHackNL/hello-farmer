import $ from 'jquery';
import L from 'leaflet';
import getIcon from './icon';
import geojson from '../vechtdal.geojson';

const position    = [52.5166077, 6.1483097]; // Zwolle
const initialZoom = 12;
const finalZoom   = 16;

const map = L.map('app').setView(position, initialZoom);

setTimeout(() => { map.setZoom(finalZoom, {animate: true}); }, 1000);
// load geojson after zooming + animation (css-based), doesn't scale too well :(
setTimeout(() => {
  L.geoJson(geojson, {
    onEachFeature: (feature, layer) => {
      // add popup
      layer.bindPopup(popupData(feature), {minWidth: 250, maxWidth: 380});
      // add marker
      if (feature.geometry && feature.geometry.type === 'Polygon') {
        const geom = L.polygon(feature.geometry.coordinates[0].map(a => L.latLng([a[1], a[0]])));
        const pos = geom.getBounds().getCenter();
        const icon = getIcon(feature.properties.produce_id) || getIcon(feature.properties.crop_id);
        icon && L.marker(pos, {icon: icon}).addTo(map);
      };
    }
  }).addTo(map);
}, 1800);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


function popupData(feature) {
  const props = feature.properties;
  let items = [];
  items.push([`
    <h2 class="pre-title">${props.producer || 'Vechtdal Boer'}</h2>
    <h1>${props.name}</h1>
  `, false]);
  props.image_urls && items.push([
    `<div class="text-center"><img src="${props.image_urls[0]}"></div>`
  , false])
  props.description && items.push([props.description, false]);
  props.info_url && items.push(['Lees meer over de boer <i class="glyphicon glyphicon-chevron-right pull-right" style="margin-top: 3px"></i>', props.info_url])
  return '<div class="listgroup map-popup">' + items.map(i => `<${i[1] ? `a href='${i[1]}'` : 'div'} class="list-group-item">${i[0]}</${i[1] ? 'a' : 'div'}>`).join('') + '</div>';
}

// easter egg
$('#logo').on('click', () => {
  alert('Hallo bezoeker!')
})
