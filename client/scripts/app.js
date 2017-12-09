// YOUR CODE HERE:
const app = {};
var messageArray = [];

app.renderChats = function(data, $root, refreshRate, messageLimit) {
  var tmpArray = data.results;
  console.log(messageArray); 
  var rooms = {};
  tmpArray.forEach((message) => {
    var roomname = app.filterMessage(message.roomname);
    if (rooms[roomname] === undefined) {
      rooms[roomname] = [];
    }
    rooms[roomname].push(message);
  });
  var roomNames = Object.keys(rooms);
  var $roomSelector = $('.roomSelector');
  
  //MAYBE WE DONT NEED DYNAMIC REFRESH HERE//
  $roomSelector.children().remove();
  roomNames.forEach((room) => {
    $roomSelector.append(`<option value=${room}>${room}</option>`);
  });

  if (messageArray.length === 0 ||
    tmpArray[0].createdAt > messageArray[0].createdAt) {
    // refresh message set
    messageArray = tmpArray.slice();
    // messageArray = [];
    // for (var i = 0; i < tmpArray.length; i++) {
    //   messageArray.push(tmpArray[i]);
    // }


    // clear DOM
    app.clearMessages();
    // add new message set
    for (var i = 0; i < messageArray.length; i++) {
      app.renderMessage(messageArray[i], $root);
    }
  }
};

app.filterMessage = function(html) {
  var responseString = '';
  for (let index in html) {
    switch (html[index]) {
    case '&':
      html = html.slice(0, index).concat('&amp;').concat(html.slice(index + 1));
      break;
    case '<':
      html = html.slice(0, index).concat('&lt;').concat(html.slice(index + 1));
      break;
    case '>':
      html = html.slice(0, index).concat('&gt;').concat(html.slice(index + 1));
      break;
    case '"':
      html = html.slice(0, index).concat('&quot;').concat(html.slice(index + 1));
      break;
    case '\'':
      html = html.slice(0, index).concat('&#x27;').concat(html.slice(index + 1));
      break;
    case '/':
      html = html.slice(0, index).concat('&#x2F;').concat(html.slice(index + 1));
      break;
    }
  }
  return html;
};

app.init = function(url, refreshRate, messageLimit) {
  const $root = $('#chats');
  app.URL = url;
  app.fetch(app.URL, app.renderChats, $root, refreshRate, messageLimit);
  setInterval(function() {
    app.fetch(app.URL, app.renderChats, $root, refreshRate, messageLimit);
  }, refreshRate);
  
  $("#messageSubmit").submit(function(event) {

        /* stop form from submitting normally */
    event.preventDefault();

    /* get the action attribute from the <form action=""> element */
    var $form = $( this );
    alert($form.attr( 'enter' ));

    });
};

app.send = function(url, message) {
  var message = {
    username: 'shawndrost',
    text: message,
    roomname: '4chan'
  };
  var messageString = JSON.stringify(message);
  $.post(url, { "data" : messageString});
};

app.fetch = function(url, renderFunction, ...args) {
  $.get(url, { "order": "-createdAt" }, function (data) {
    renderFunction(data, ...args);
  });
};

app.clearMessages = function() {
  $('#chats').children().remove();
};

app.renderMessage = function(message, $node) {
  
  var createdAt = app.filterMessage(message.createdAt);
  var roomName = app.filterMessage(message.roomname);
  var text = app.filterMessage(message.text);
  var username = app.filterMessage(message.username);
  var createdAt = app.filterMessage(message.createdAt);
  
  $node.append(`<div class="message" id="${createdAt}">
  <div>roomname: ${roomName} </div>
  <div>text: ${text}</div>
  <div>user: ${username}</div>
  <div>date: ${createdAt}</div>
  </div>`);
};

app.clearRoom = function() {
  
};

const URL = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';
const REFRESH_RATE = 3000;
const MESSAGE_LIMIT = 20;
app.init(URL, REFRESH_RATE, MESSAGE_LIMIT);

// refresh every ... seconds
