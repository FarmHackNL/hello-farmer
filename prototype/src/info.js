import {region} from './regions';
import {getImage} from './icon';

export function infoPlace(place) {
  const image_url = place.image_url || getImage(place.type);
  const img = image_url ? `<img src="${image_url}">` : '<div class="img-placeholder"></div>';
  const name = `<p><b>${place.name}</b></p>`;
  return img + name;
}

export function infoLand(land) {
  const image_url = land.image_url || getImage(land.produce_id) || getImage(land.crop_id);
  const img = image_url ? `<img src="${image_url}">` : '<div class="img-placeholder"></div>';
  const name = `<div><b>${land.crop_name}</b></div>`;
  const producer_obj = region.data.places.find(p => parseInt(p.id) === parseInt(land.producer_id));
  const producer_name = producer_obj ? producer_obj.name : land.producer;
  const producer = producer_name ? `<div>${producer_name}</div>` : '';
  return img + name + producer;
}

export default {infoPlace, infoLand};
