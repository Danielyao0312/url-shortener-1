'use strict';
const bijective = require('./bijective');


module.exports.encode = function *encode () {
    const long_url = this.request.body.long_url;
    const url = yield this.shorts.findOne({ long_url }, "long_url short_url")
    console.log(url);
    //TODO return short url
    // var Cat = mongoose.model('Cat', { name: String });

    // var kitty = new Cat({ name: 'Zildjian' });
    // kitty.save(function (err) {
    //   if (err) // ...
    //   console.log('meow');
    // });
    const short_url = bijective.encode();
}

module.exports.decode = function *decode () {
    const str = this.req.url.substr(1);
    this.body = bijective.decode(str);
    //TODO redirect or 404
}