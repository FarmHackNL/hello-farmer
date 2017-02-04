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
  let results = find(region.data.products, term).concat(find(region.data.places, term));
  let html = null;

  if (results.length > 0) {
    html = uniq(results.map(f => {
      let name = f.name;
      let icon = f.produce_id || f.crop_id || f.type;
      let producer = f.producer || '&nbsp;';
      let img = `<img src="${getImage(icon)}" width="150" alt="${icon}">`;
      if (!icon) return; // show only with icon
      return `<a href="#" class="btn btn-default result-item">${img}<div>${name}</div><div><b>${producer}</b></div></a>`;
    }));
  }

  if (!html) {
    html = '<p><i>Geen gewassen gevonden.</i></p>';
  }

  $('#result').html(html);
}

function find(entries, term) {
  return entries.filter(f => (
    (f.name || '').includes(term)
  ));
}

export default {open, close, search};
