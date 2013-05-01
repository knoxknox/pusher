var events = require('events');

/**
 * Constructor.
 * @param {String} eventName - name of pubsub event
 */
var msgbus = function(eventName) {
    this.eventName = eventName;
}
msgbus.prototype = new events.EventEmitter;

/**
 * Fires event with given message.
 * @param {Object} message - message body
 */
msgbus.prototype.publish = function(message) {
    this.emit(this.eventName, message);
};

exports.msgbus = msgbus;
