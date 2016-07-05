import $ from 'jquery';

// initial zoom animation after map load
export default function(map, position, layers) {
  let loading = layers.length;
  layers.forEach((layer) => {
    layer.on('load', () => {
      loading -= 1;
      if (loading === 0) {
        startAnimation(map, position);
      }
    });
  });
  $('#intro-container').fadeIn('slow');
}

function startAnimation(map, position) {
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
