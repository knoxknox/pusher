pusher
=================

When you need more interactivity in your web-applications, you think about real-time messaging.
One of the possible solution is to use a special [Comet](http://goo.gl/Gf0J) server.
This allows a web server to push data to a browser, without the browser explicitly requesting it.

Pusher allows you to build awesome live web-applications.
It works as a standalone server via HTTP protocol, builds on [node.js](http://nodejs.org) and [socket.io](http://socket.io/).
You could use PHP, Ruby, Java or something else and easily deliver the notification messages to the clients browsers.
This comet server provides a simple way to deliver messages to a specific user, group of users or special channels.
Receiving messages in the browser is as simple as connecting to the push server and subscribing to topics or channels.

## Installation and Usage

1. Install node.js ([manual](https://github.com/joyent/node/wiki/Installation))
2. Clone this repository
3. Navigate to the just copied directory
4. Install comet server `npm install`
5. To run comet server just type `node index.js`
6. To send message run `ruby /sample/ruby/publish.rb`


## Supported browsers
- IE 5.5+
- Safari 3+
- Firefox 3+
- Opera 10.61+
- Google Chrome 4+
