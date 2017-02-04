import {mapValues} from 'lodash';

const images = {
  // places
  farm: require('./assets/icons/farm.png'),
  shop: require('./assets/icons/shop.png'),
  bakery: require('./assets/icons/shop.png'),
  brewery: require('./assets/icons/shop.png'),
  hotel: require('./assets/icons/restaurant.png'),
  restaurant: require('./assets/icons/restaurant.png'),
  recreation: require('./assets/icons/recreation.png'),
  'place-default': require('./assets/icons/empty.png'),

  // produce & products
  bread: require('./assets/icons/bread.png'),
  brocolli: require('./assets/icons/broccoli.png'),
  carrots: require('./assets/icons/carrot.png'),
  kip: require('./assets/icons/chicken.png'),
  cow: require('./assets/icons/cow.png'),
  egg: require('./assets/icons/egg.png'),
  pig: require('./assets/icons/pig.png'),
  graan: require('./assets/icons/graan.png'),
  pompoen: require('./assets/icons/pumpkin.png'),
  potato: require('./assets/icons/potato.png'),
};

export function getImage(id) {
  return images[id];
}


function makeIcon(icon) {
  return L.icon({
    iconUrl: icon,
    iconSize: [75, 75],
    iconAnchor: [39, 70],
  });
}

const markers = mapValues({
  // places
  farm: require('./assets/markers/farm.png'),
  shop: require('./assets/markers/shop.png'),
  bakery: require('./assets/markers/shop.png'),
  brewery: require('./assets/markers/shop.png'),
  hotel: require('./assets/markers/restaurant.png'),
  restaurant: require('./assets/markers/restaurant.png'),
  recreation: require('./assets/markers/recreation.png'),
  'place-default': require('./assets/markers/empty.png'),

  // produce & products
  bread: require('./assets/markers/bread.png'),
  brocolli: require('./assets/markers/broccoli.png'),
  carrots: require('./assets/markers/carrot.png'),
  kip: require('./assets/markers/chicken.png'),
  cow: require('./assets/markers/cow.png'),
  egg: require('./assets/markers/egg.png'),
  pig: require('./assets/markers/pig.png'),
  graan: require('./assets/markers/graan.png'),
  pompoen: require('./assets/markers/pumpkin.png'),
  potato: require('./assets/markers/potato.png'),
  'product-default': require('./assets/markers/empty.png'),
}, makeIcon);

export function getIcon(id) {
  return markers[id];
}
