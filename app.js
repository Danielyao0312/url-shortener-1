'use strict';
const messages = require('./controllers/messages');
const shorten = require('./controllers/shortener');
const compress = require('koa-compress');
const logger = require('koa-logger');
const serve = require('koa-static');
const route = require('koa-route');
const koa = require('koa');
const path = require('path');
const app = module.exports = koa();
const mongoose = require('mongoose');
const bodyParser = require('koa-bodyparser');


mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/url');
app.use(bodyParser());



app.use(function * (next) {
    this.mongoose = mongoose;
    
    const schema = new mongoose.Schema({ 
        long_url: 'string', 
        short_url: 'string',
        seq: { type: 'number', default: 0 }
    });
    const shorts = this.shorts = this.mongoose.model('shorten', schema);
    
    
    const entitySchema = mongoose.Schema({
        testvalue: {type: 'string'}
    });

    entitySchema.pre('save', function (next) {
        const doc = this;
        shorts.findByIdAndUpdate({_id: 'entityId'}, {$inc: { seq: 1} }, function (error, counter)   {
            if(error)
                return next(error);
            doc.testvalue = shorts.seq;
            next();
        });
    });

    yield next;
})

// Logger
app.use(logger());

app.use(route.get('/', messages.home));
app.use(route.get('/messages', messages.list));
app.use(route.get('/messages/:id', messages.fetch));
app.use(route.post('/messages', messages.create));
app.use(route.get('/async', messages.delay));


// Serve static files
app.use(serve(path.join(__dirname, 'public')));

app.use(route.get('/*', shorten.decode));
app.use(route.post('/api/shorten', shorten.encode));

// Compress
app.use(compress());

if (!module.parent) {
  app.listen(3000);
  console.log('listening on port 3000');
}