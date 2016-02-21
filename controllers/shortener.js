'use strict';
const bijective = require('./bijective');


module.exports.encode = function *encode () {
    var long_url = this.request.body.long_url;
    if (!/^https?:\/\//.test(long_url))
        long_url = "http://" + long_url;
    
    var url = yield this.short.findOne({ long: long_url }, "seq")
    if (!url) {
        url = yield this.short.create({ long: long_url })
    }
    
    this.body = `${this.request.origin}\\${bijective.encode(url.seq)}`;
    
}

module.exports.decode = function *decode () {
    const str = this.req.url.substr(1);
    const seq = bijective.decode(str);
    var url = yield this.short.findOne({ seq }, "long");
    if (url) {
        this.status = 301;
        this.redirect(url.long);
    } else {
        this.status = 404;
        this.body = "Not Found";
    }
}