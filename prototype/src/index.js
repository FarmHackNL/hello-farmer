import L from 'leaflet';
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
      layer.bindPopup(popupData(feature));
    }
  }).addTo(map);
}, 2000);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

function popupData(feature) {
  const defaultProps = {
    Producer: 'Boer Piet',
    Description: 'Onze zwartbont koeien zijn blije biologische koeien en zo meer.',
    Crop: 'gras',
    Animal: 'cow',
    info_url: 'http://boerpiet.example.com/',
  };
  const props = {...defaultProps, ...feature.properties};
  let items = [];
  items.push([`
    <h2 class="pre-title">${props.Producer}</h2>
    <h1>${props.Name}</h1>
    <p>${props.Description}</p>
  `, false]);
  props.info_url && items.push(['Lees meer <i class="glyphicon glyphicon-chevron-right"></i>', props.info_url])
  return '<div class="listgroup map-popup">' + items.map(i => `<${i[1] ? 'a href=`$i[1]`' : 'div'} class="list-group-item">${i[0]}</${i[1] ? 'a' : 'div'}>`).join('') + '</div>';
}
