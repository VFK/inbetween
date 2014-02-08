# Inbetween [![NPM version][npm-image]][npm-url]

A fast and simple MITM-proxy for Node.js. No https support for now.

## Installation

Install `inbetween` via NPM:
```shell
npm install inbetween
```

Create `main.js` like so:
```javascript
var Proxy = require('inbetween');
var proxy = new Proxy(8080);
```

Run your `main.js`:
```shell
node main.js
```

That's it, now tell you apps to use **localhost:8080** as an HTTP proxy.

## API

#### proxy.rewriteUrl(url)
Type: `String`  
Full URL, for example http://something.com/index.php?test=true

Simple example:
```javascript
// Route any request to nodejs website
proxy.rewriteUrl = function(url) {
    url = 'http://nodejs.org';
    return url;
}
```

Advanced example:
```javascript
// Make http://test.com?hello=world to be http://test.com?hello=wild
var qs = require('querystring');
....
proxy.rewriteUrl = function(url) {
    var parts = url.split('?');
    if (parts.length === 2) {
        var obj = qs.parse(parts[1]);
        obj['hello'] = 'wild';
        parts[1] = qs.stringify(obj);
    }
    return parts.join('?');
}
```
Remember to always return your url.

#### proxy.rewriteHeaders(headers)
Type: `Object`  
Request headers. More info in Node.js docs: [http.IncomingMessage.headers](http://nodejs.org/api/http.html#http_message_headers)

```javascript
// Spoof user-agent
proxy.rewriteHeaders = function(headers) {
    headers['user-agent'] = 'NSA-agent v3.5.7';
    return headers;
}
```
Remember to always return your headers object.

#### proxy.rewriteData(data)
Type: `String`  
POST data. Usually looks like *user=MegaDestroyer98&password=123321*  
Rewrite it the same way as you rewrite an url.  
Remember to always return your data.

[npm-url]: https://npmjs.org/package/inbetween
[npm-image]: https://badge.fury.io/js/inbetween.png