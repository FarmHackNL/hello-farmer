import $ from 'jquery';

let animationStarted = false;

// initial zoom animation after map load
export default function(map, position, layers) {
  let loading = layers.length;
  layers.forEach((layer) => {
    layer.on('load', () => {
      loading -= 1;
      if (loading === 0 && !animationStarted) {
        startAnimation(map, position);
      }
    });
  });
  $('#intro-container').fadeIn('slow');
  // but also on timeout, in case load events were missed (e.g. already loaded)
  // @todo proper implementation catching load events always
  setTimeout(() => !animationStarted && startAnimation(map, position), 800);
}

function startAnimation(map, position) {
  animationStarted = true;
  $('#intro-container').fadeIn('slow', function() {
    setTimeout(function() {
      $('#intro > div').fadeOut('slow');
      setTimeout(() => {
        $('#intro-container').hide();
        map.setView([position[0], position[1]], position[2], {animate: true});
      }, 250);
    }, 500);
  });
}
