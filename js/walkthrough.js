// walkthrough.js
// Copyright (c) 2014, Eren Okka
// https://github.com/erengy/walkthrough

var walkthroughData = null;

var walkthroughOptions = {
  hideSpoilers: true
}

function loadWalkthrough(data) {
  if (data) {
    walkthroughData = data;
    initDocument();
  }
}

////////////////////////////////////////////////////////////////////////////////

function initDocument() {
  var title = walkthroughData.meta.title + ' Walkthrough';
  document.title = title;
  $('#header #title').html(title);
  $('meta[name=author]').attr('content', walkthroughData.meta.author);
  $('#header #description').html(walkthroughData.meta.description);

  createNavigationList();
}

function applySpoilerOption() {
  walkthroughOptions.hideSpoilers = $('#options #spoilers').prop('checked');

  var next = $('#main #choices tbody .next');

  if (walkthroughOptions.hideSpoilers) {
    // Hide all future lines except the next one
    next.removeClass('hidden');
    next.nextAll().addClass('hidden');
  } else {
    next.siblings().removeClass('hidden');
  }
}

function trackProgress(element) {
  // Mark previous lines
  $(element).addClass('previous');
  $(element).prevAll().addClass('previous');
  $(element).nextAll().removeClass('previous');

  // Mark next line
  $(element).removeClass('next');
  $(element).siblings().removeClass('next');
  $(element).next().addClass('next');

  applySpoilerOption();
  if (walkthroughOptions.hideSpoilers) {
    // Make sure the next line is in view
    $(element).next().get(0).scrollIntoView();
  }
}

////////////////////////////////////////////////////////////////////////////////

function createNavigationList() {
  var routes = walkthroughData.routes;

  $('#nav').removeClass('hidden');

  for (var i = 0; i < routes.length; i++) {
    $('#nav #routes').append('<li><a href="#" id="' + routes[i].id + '">' +
                             routes[i].title + '</a></li>');
  }
}

function createMainContent(routeId) {
  var routeIndex = findRouteIndexById(routeId);
  var route = walkthroughData.routes[routeIndex];

  $('#main').removeClass('hidden');

  $('#main #title').html(route.title);

  if (route.description) {
    $('#main #description').html('<p>' + route.description + '</p>');
  } else {
    $('#main #description').html('');
  }

  createChoiceTable(route);
}

function createChoiceTable(routeParent) {
  var route = routeParent.route;

  if (!route) {
    $('#main #choices').html('');
    return;
  }

  var table = $('<table>');

  // Header
  table.append('<thead>');
  $('thead', table).append('<tr>');
  $('thead tr', table).append(
      $('<th>', {'style': 'width: 25%'}));
  $('thead tr', table).append(
      $('<th>', {'style': 'width: 75%',
                 html: '<span class="route">Choices</span>'}));

  // Body
  table.append('<tbody>');
  for (var i = 0; i < route.length; i++) {
    var date = route[i].date;
    var choices = route[i].choices;
    for (var j = 0; j < choices.length; j++) {
      var tr = $('<tr>');
      tr.append('<td>');
      if (j == 0 && date) {
        tr.attr('class', 'first');
        $('td', tr).append(makeSpan('date', date));
      }
      tr.append('<td>' + getTableCellData(choices[j]) + '</td>');
      $('tbody', table).append(tr);
    }
  }

  $('#main #choices').html(table);
  $('#main #choices table tbody tr').first().addClass('next');
}

function findRouteIndexById(routeId) {
  var routes = walkthroughData.routes;

  for (var i = 0; i < routes.length; i++) {
    if (routes[i].id === routeId) {
      return i;
    }
  }

  return null;
}

function getTableCellData(object) {
  var html = '';

  // Array
  if (Array.isArray(object)) {
    for (var i = 0; i < object.length; i++) {
      if (html !== '') {
        html += '<br/>';
      }
      html += getTableCellData(object[i]);
    }

  // Object
  } else if (typeof object === 'object') {
    if (object.save) {
      html += makeSpan('alert', '(Create Save ' + object.save + ')');
    } else if (object.load) {
      html += makeSpan('alert', '(Load Save ' + object.load + ')');
    } else if (object.end) {
      html += makeSpan('alert', '(' + object.end + ')');
    } else {
      if (object.choice) {
        html += object.choice;
      }
      if (object.comment) {
        html += makeSpan('comment', ' (' + object.comment + ')');
      }
    }

  // String
  } else {
    html += object;
  }

  return html;
}

function makeSpan(className, text) {
  return '<span class="' + className + '">' + text + '</span>';
}

////////////////////////////////////////////////////////////////////////////////
// Event handlers

$('#nav ul').on('click', 'li a', function() {
  createMainContent(this.id);
  applySpoilerOption();
  return false;  // Prevent default
});

$('#options').on('click', '#spoilers', function() {
  applySpoilerOption();
});

$('#main').on('click', '#choices table tbody tr', function() {
  trackProgress(this);
});