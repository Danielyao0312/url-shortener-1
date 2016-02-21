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
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/url');
app.use(bodyParser());


const UrlSchema = new mongoose.Schema({
    long: { type: String, unique: true, required: true },
    seq: { type: Number, default: 0 }
});
const short = mongoose.model('shorten', UrlSchema);

const CounterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});
CounterSchema.on('init', function (model) {
    model.findOne({ _id: 'urlId' })
        .then(function (entity) {
            if (!entity) 
                model.create({ _id: 'urlId' });
        })
})
const counter = mongoose.model('counter', CounterSchema);


UrlSchema.pre('save', function (next) {
    const doc = this;
    counter.findByIdAndUpdate({ _id: 'urlId' }, { $inc: { seq: 1 } })
        .then(function (counterObj) {
            doc.seq = counterObj.seq;
            next();
        }).catch(next)
});

app.use(function* (next) {
    this.mongoose = mongoose;
    this.short = short;
    
    yield next;
})

// Logger
app.use(logger());

// TODO 待删除
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
    const port = process.env.PORT | 3000;
    app.listen(port, '0.0.0.0');
    console.log(process.env);
    console.log(`listening on port ${port}`);
}