var http = require('http'),
    qs = require('querystring'),
    events = require('./msgbus');

/**
 * Init msgbus for publish / subscribe.
 *
 * @param {String} eventName - name of pubsub event
 * @return {Object} class inherited from EventEmitter
 */
var msgbus = new events.msgbus('push');

/**
 * Wrapper for node HTTP server.
 */
var Server = {

    /**
     * @public
     * Listen for connections on the specified port and host.
     * Apply input arguments to server (port, hostname, backlog, callback).
     *
     * @return {http.Server} server, that listening for connections
     */
    listen: function() {
        var callback = Server.handleRequest,
            server = http.createServer(callback);

        return server.listen.apply(server, arguments);
    },

    /**
     * @private
     * Handles incoming user requests.
     * Only POST requests will be processed.
     *
     * @param {http.ServerRequest} request
     * @param {http.ServerResponse} response
     */
    handleRequest: function(request, response) {
        if (request.method == 'POST') {
            var body = '';

            request.on('data', function(chunk) {
                body += chunk;
            });

            request.on('end', function() {
                var data = qs.parse(body),
                    message = Server.handleMessage(data);
                if (data && message) { // fire event 'push'
                    msgbus.publish(message);
                }
            });
        }

        response.end();
    },

    /**
     * @private
     * Handles incoming request message.
     * Decodes it and returns back as object.
     *
     * @param {Object} data - incoming message
     * @return {Object} decoded message or null
     */
    handleMessage: function(data) {
        var message;
        if (data && data.message) {
            message = JSON.parse(data.message);
            if (Server.bodyIsEncoded(message.body)) {
                var msg = JSON.parse(message.body.data[0]);
                message.body.data = ('data' in msg) ? msg.data : msg;
            }
        }

        return message;
    },

    /**
     * @private
     * Returns true if body of the message is encoded.
     * This check used only when data is a result from Ruby template.
     *
     * @param {Object} v - body of the message
     * @return {Boolean} true if body is encoded
     */
    bodyIsEncoded: function(v) {
        return v && v.data && v.data[0] && typeof(v.data[0]) == 'string';
    }

};

exports.subscribe = msgbus;
exports.listen = Server.listen;
