'use strict';

function ApiEndpoint(name) {
    this.name = name;
    this.path = null;
    this.minVersion = null;
    this.maxVersion = null;
}

ApiEndpoint.prototype.update = function(data) {
    if (!data || !data.path) { return; }
    this.path = data.path;
    this.maxVersion = data.maxVersion || 1;
    this.minVersion = data.minVersion || 1;
    return this;
};

ApiEndpoint.prototype.getUri = function() {
    return '/webapi/' + this.path + '?api=' + this.name + '&version=' + this.maxVersion;
};

module.exports = ApiEndpoint;