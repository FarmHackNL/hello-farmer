import $ from 'jquery';
import L from 'leaflet';
import {debounce} from 'lodash';
import loadanim from './loadanim';
import {getIcon} from './icon';
import {region} from './regions';
import search from './search';
import {highlightPlace, highlightLand} from './highlight';


const map = L.map('app').setView([region.loadPosition[0], region.loadPosition[1]], region.loadPosition[2]);
$('#intro-text').text(region.loadTitle);

// marker objects on map for showing/hiding
const markers = {
  places: [],
  lands: [],
};

const layers = [
  // places
  L.featureGroup(region.data.places.map(place => {
    const icon = getIcon(place.type) || getIcon('place-default');
    const _popupData = placePopupData(place);
    const marker = L.marker([place.lat, place.lon], {icon: icon}).bindPopup(_popupData, {minWidth: 250, maxWidth: 380});
    marker.on('mouseover', () => { highlightPlace(layers, markers, place); });
    marker.on('mouseout', () => { highlightPlace(layers, markers); });
    markers.places[place.id] = marker;
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
          marker.on('mouseover', () => { highlightLand(layers, markers, feature.properties); });
          marker.on('mouseout', () => { highlightLand(layers, markers); });
          markers.lands[feature.properties.id] = marker;
        }
      }
    }
  }).on('mouseover', e => {
    highlightLand(layers, markers, e.layer.feature.properties);
  }).on('mouseout', e => {
    highlightLand(layers, markers);
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
