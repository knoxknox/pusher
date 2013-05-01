var io;

/**
 * Wrapper for socket.io connections.
 */
var Connections = {

    /**
     * @public
     * Start socket.io and listening for connections.
     *
     * @param {http.Server} server - instance of node server
     * @return {Object}
     */
    listen: function(server) {
        io = require('socket.io').listen(server);
        io.sockets.on('connection', function(socket) {
            console.log('Open connection ' + socket.id);

            /**
             * Fires when client connecting to server.
             * Keep uid and channel in current socket and join to room.
             *
             * @param {Integer} uid - specific ID of user
             * @param {String} channel - channel for which user subscribes
             */
            socket.on('authorize', function(uid, channel) {
                console.log('Authorize ' + uid);
                socket.set('uid', uid, function() {
                    socket.join(channel);
                    socket.room = channel;
                    socket.broadcast.emit(channel, uid + ' connected');
                    console.log(uid + ' joined to channel ' + channel);
                });
            });

            /**
             * Fires when client disconnect from server.
             */
            socket.on('disconnect', function() {
                console.log('Close connection ' + socket.id);
            });

        });

        return Connections;
    },

    /**
     * @public
     * Get filtered list of connected browser sockets.
     * The message is delivered only for sockets from this list.
     * If meta.channel is undefined returns all connected sockets.
     * Returns only sockets, that present in 'channel' or 'ids' fields.
     *
     * @param {Object} meta - package metainfo
     * @option {Integer} meta.uid - id of logged in user, that exclude from list
     * @option {Array} meta.ids - ids of users for which associated sockets returns
     * @option {String} meta.channel - channel for which associated sockets returns
     * @return {Array} list of filtered sockets
     */
    getClients: function(meta) {
        var room = meta.channel ? '/' + meta.channel : '',
            socketIds = io.sockets.manager.rooms[room];

        return socketIds ? this.collectSockets(socketIds, meta) : [];
    },

    /**
     * @private
     * Returns list of filtered sockets.
     * If field 'ids' is present - filter only by this user ids.
     * If field 'channel' is present - filter only by this channel.
     * If both (ids and channel) are present - filter by ids in given channel.
     *
     * @param {Array} socketIds - id's of sockets to filter
     * @param {Object} meta - information from package meta
     * @return {Array} filtered sockets or empty array
     */
    collectSockets: function(socketIds, meta) {
        var sockets = [];
        socketIds.forEach(function(id) {
            var socket = this.socket(id);
            var uid = socket.store.data.uid;

            if (!uid || uid == meta.uid) return true;
            if (meta.ids && meta.ids.indexOf(uid) == -1) return true;

            sockets.push(socket);
        }, io.sockets);

        return sockets;
    }

};

exports.listen = Connections.listen;
exports.getClients = Connections.getClients;
