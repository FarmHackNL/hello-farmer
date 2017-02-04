import {mapValues} from 'lodash';

function makeIcon(icon) {
  return L.icon({
    iconUrl: icon,
    iconSize: [56, 75],
    iconAnchor: [27, 71],
  });
}

var images = {
  // places
  farm: require('./assets/place-farm.png'),
  shop: require('./assets/place-shop.png'),
  bakery: require('./assets/place-shop.png'),
  brewery: require('./assets/place-shop.png'),
  hotel: require('./assets/place-shop.png'),
  restaurant: require('./assets/place-shop.png'),
  'place-default': require('./assets/place-default.png'),

  // produce
  cow: require('./assets/cow.png'),
  pig: require('./assets/pig.png'),
  kip: require('./assets/kip.png'),
  graan: require('./assets/graan.png'),
  carrots: require('./assets/carrots.png'),
  pompoen: require('./assets/pompoen.png'),
  brocolli: require('./assets/brocolli.png'),

  // products
};

var icons = mapValues(images, makeIcon);

export function getIcon(id) {
  return icons[id];
}
export function getImage(id) {
  return images[id];
}
