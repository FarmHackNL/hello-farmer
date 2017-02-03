import $ from 'jquery';

function open() {
  $('#result').fadeIn();
}

function close() {
  $('#result').fadeOut();
}

function search(term) {
  $('#result').html('Sorry, no products yet.');
}

export default {open, close, search};
