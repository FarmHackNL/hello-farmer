function makeIcon(icon) {
  return L.icon({
    iconUrl: icon,
    iconSize: [56, 75],
    iconAnchor: [27, 71],
  });
}

var icons = {
  cow: makeIcon(require('./assets/cow.png')),
  pig: makeIcon(require('./assets/pig.png')),
  kip: makeIcon(require('./assets/kip.png')),
  carrots: makeIcon(require('./assets/carrots.png')),
  pompoen: makeIcon(require('./assets/pompoen.png')),
  brocolli: makeIcon(require('./assets/brocolli.png')),
};
export default function getIcon(id) {
  return icons[id];
}
