'use strict';

var http = require('http');
var url = require('url');

var Proxy = function (port) {
    var server = http.createServer(function (request, response) {
        var original_url = this.rewriteUrl(request.url);
        var options = url.parse(original_url);
        options.headers = this.rewriteHeaders(request.headers);
        options.method = request.method;

        var proxy_request = http.request(options, function (proxy_response) {
            response.writeHead(proxy_response.statusCode, proxy_response.headers);
            proxy_response.pipe(response);
        });

        if (this.hasOwnProperty('rewriteData')) {
            var request_data = '';
            request.on('data', function (chunk) {
                request_data += chunk;
            });
            request.on('end', function () {
                var data = this.rewriteData(request_data);
                if (data) {
                    proxy_request.write(data);
                }
            }.bind(this));
        } else {
            request.on('data', function (chunk) {
                proxy_request.write(chunk);
            });
        }
        proxy_request.on('error', function () {
            response.end();
        });
        proxy_request.end();
    }.bind(this));
    server.listen(port);

};

Proxy.prototype.rewriteUrl = function (original_url) {
    return original_url;
};

Proxy.prototype.rewriteHeaders = function (original_headers) {
    return original_headers;
};

Proxy.prototype.rewriteData = function (original_data) {
    return original_data;
};

module.exports = Proxy;