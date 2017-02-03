import $ from 'jquery';
import {uniq} from 'lodash';
import {getImage} from './icon';

function open() {
  $('#result').fadeIn();
}

function close() {
  $('#result').fadeOut();
}

function search(region, term) {
  let results = find(region.geojson.lands.features, term);
  let html = null;

  if (results.length > 0) {
    html = uniq(results.map(f => {
      let name = f.properties.name || f.properties.crop_name;
      let icon = f.properties.produce_id || f.properties.crop_id || f.properties.type;
      let producer = f.properties.producer || '&nbsp;';
      let img = `<img src="${getImage(icon)}" width="150" alt="${icon}">`;
      let url = `#${region.id}/${producer}/${name}`;
      if (!icon) return; // show only with icon
      return `<a href="${url}" class="btn btn-default result-item">${img}<div>${name}</div><div><b>${producer}</b></div></a>`;
    }));
  }

  if (!html) {
    html = '<p><i>Geen gewassen gevonden.</i></p>';
  }

  $('#result').html(html);
}

function find(features, term) {
  return features.filter(f => (
    f.properties && (
      (f.properties.crop_name || '').includes(term) ||
      (f.properties.name || '').includes(term)
    )
  ));
}

export default {open, close, search};
