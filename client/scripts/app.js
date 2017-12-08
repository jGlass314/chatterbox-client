// YOUR CODE HERE:
const URL = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';
const root = $('#main');



var renderChats = function(url, rootNode, numberOfMessages) {
  $.get(url, function(data) {
    var messageArray = data.results;
    console.log(messageArray);
    for(var i = 0; i < numberOfMessages; i++) {
      rootNode.append('<div>');
      rootNode.append('<div>roomname: '  + messageArray[i].roomname + '</div>');
      rootNode.append('<div>text: '  + messageArray[i].text + '</div>');
      rootNode.append('<div>user: '  + messageArray[i].username + '</div>');
      rootNode.append('</div>');
    }
  });



};


/*setInterval(function() {
  renderChats(URL, root, 5)
}, 3000);*/
renderChats(URL, root, 5);
