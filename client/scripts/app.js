// YOUR CODE HERE:
const app = {};
var messageArray = [];

app.renderChats = function(data, $root, refreshRate, messageLimit, roomName) {
  var tmpArray = data.results;
  roomName = roomName ? roomName : app.currentRoom;
  var rooms = {};
  tmpArray.forEach((message) => {
    var roomname = app.filterMessage(message.roomname);
    if (rooms[roomname] === undefined) {
      rooms[roomname] = [];
    }
    rooms[roomname].push(message);
  });
  
  if (!roomName) {
    var roomNames = Object.keys(rooms).sort();
    var $roomSelector = $('.roomSelector');
    
    $roomSelector.children().remove();
    roomNames.forEach((room) => {
      $roomSelector.append('<option value=\"' + room + '\">' + room + '</option>');
    }); 
  }

  if (messageArray.length === 0 ||
    tmpArray[0].createdAt > messageArray[0].createdAt ||
    roomName !== undefined) {
    // refresh message set
    if (roomName === undefined) {
      messageArray = tmpArray.slice();
    } else {
      messageArray = rooms[roomName];
    }
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
      responseString = responseString.concat('&amp;').concat(html.slice(index + 1));
      break;
    case '<':
      responseString = responseString.concat('&lt;').concat(html.slice(index + 1));
      break;
    case '>':
      responseString = responseString.concat('&gt;').concat(html.slice(index + 1));
      break;
    case '"':
      responseString = responseString.concat('&quot;').concat(html.slice(index + 1));
      break;
    case '\'':
      responseString = responseString.concat('&#x27;').concat(html.slice(index + 1));
      break;
    case '/':
      responseString = responseString.concat('&#x2F;').concat(html.slice(index + 1));
      break;
    default:
      responseString = responseString.concat(html[index]);
      break;
    }
  }
  return responseString;
};

app.getUrlVars = function() {
  var vars = [];
  var hash;
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
};

app.init = function(url, refreshRate, messageLimit) {
  const $root = $('#chats');
  app.URL = url;
  app.fetch(app.URL, app.renderChats, $root, refreshRate, messageLimit);
  
  $(document).ajaxStop(function() {
    setTimeout(function() {
      app.fetch(app.URL, app.renderChats, $root, refreshRate, messageLimit);
    }, refreshRate);
  });
  
  $('body').on('click', '.friendLink', function(event) {
    if (app.currentFriend) {
      $(`.${app.currentFriend}`).css('font-weight', 'normal');
    }
    app.currentFriend = $(this).text().slice(2);
    $(`.${app.currentFriend}`).css('font-weight', 'bold');
  });
  
  $('.roomSelector').on('change', function(event) {
    event.preventDefault();
    app.currentRoom = $('.roomSelector').val();
    if (app.currentRoom === ' ') {
      app.currentRoom = undefined;
    }
    app.fetch(app.URL, app.renderChats, $root, refreshRate, messageLimit, app.currentRoom);
  });
  
  $('#messageSubmit').on('submit', function(event) {
    event.preventDefault();
    
    var $messageNode = $('.textBox');
    var $roomNode = $('.roomBox');
    var urlVars = app.getUrlVars();
    var message = {
      username: urlVars['username'],
      text: $messageNode.val(),
      roomname: $roomNode.val()
    };
    
    app.send(message);
    $('.textBox').val('');
    $('.roomBox').val('');
  });

};

app.send = function(message) {
  $.ajax({
    url: app.URL,
    type: 'POST',
    data: message,
    success: function() {
      console.log('message submitted.');
    },
    fail: function(e) {
      console.log('message send failure:', e);
    }
  });
};

app.fetch = function(url, renderFunction, ...args) {
  var roomName = args[3];
  var data = {'order': '-createdAt' };
  if (roomName !== undefined) {
    data['where'] = JSON.stringify({'roomname': roomName});
  }
  $.get(url, data, function (messageData) {
    renderFunction(messageData, ...args);
  });
};

app.clearMessages = function() {
  $('#chats').children().remove();
};

app.renderMessage = function(message, $node, roomName) {
  
  $node = $node || $('#chats');
  
  var createdAt = app.filterMessage(message.createdAt);
  var roomName = app.filterMessage(message.roomname);
  var text = app.filterMessage(message.text);
  var username = app.filterMessage(message.username).replace('%20', ' ');
  var createdAt = app.filterMessage(message.createdAt);
  
  if (username !== '' && text !== '') {
    $node.append(`<div class="message" id="${createdAt}">
    <div class="${username} messageText">${text}</div>
    <div class="friendLink userText">--${username}</div>
    <span class="friendIcon"><img src="./images/friend.png"></span>
    </div>`);
  }
};

const URL = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';
const REFRESH_RATE = 4000;
const MESSAGE_LIMIT = 20;
app.init(URL, REFRESH_RATE, MESSAGE_LIMIT);

