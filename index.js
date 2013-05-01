/**
 * node.js comet server.
 * This server gives you a realtime connections between your app and client browsers.
 * You could push data to clients using your web application via standart HTTP protocol.
 * All data from web application must be passed via POST request, and contains certain fields.
 *
 * Format of input package:
 *   meta:                                  // package meta-information
 *     uid: 100                             // id of logged in user (exclude from push)
 *     ids: [1, 5, 15]                      // ids of users, which will be receive the message
 *     channel: '7fh4910dk6uj90rtoj41'      // channel to which the message is sent
 *   body:                                  // message that will be sent to connected clients
 *     action: 'create'                     // current action that executed
 *     entity: 'comment'                    // entity name on which this action is executed
 *     data: '{"id":5,"name":"comet"}'      // data that will be sent to the client in JSON
 */

var http, io, port = 9095,
    server = require('./lib/server'),
    connections = require('./lib/connections');

http = server.listen(port);
io = connections.listen(http);
server.subscribe.on('push', function(msg) {
    var clients = io.getClients(msg.meta);
    clients.forEach(function(socket) {
        socket.emit(socket.room, msg.body);
    });
});
