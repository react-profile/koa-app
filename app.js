const Koa = require('koa');
const Router = require('koa-router');
const mongoose = require('mongoose');
const bodyParser = require('koa-bodyparser');
const passport = require('koa-passport')
const cors = require('koa2-cors');

const app = new Koa();
const router = new Router();
const port = process.env.PORT || 5000;

app.use(bodyParser());
app.use(passport.initialize());
app.use(passport.session());

const db = require('./config/keys').mongoURI;
mongoose.connect(db, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
    .then(() => {
        console.log('Mongodb Connected ...');
    })
    .catch(err => {
        console.log(err);
    });

//设置跨域访问
app.use(cors({
    origin: function (ctx) {
        //console.log(ctx.url);
        if (ctx.url === '/test') {
            return false;
        }
        return '*';
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

// import user api
const users = require('./routes/api/users');
router.use('/api/users', users);

// import profile api
const profile = require('./routes/api/profile');
router.use('/api/profile', profile);

// import posts api
const posts = require('./routes/api/posts');
router.use('/api/posts', posts);
require('./config/passport')(passport);

router.get('/', async (ctx) => {
    ctx.body = `{mesg: Hello Koa Interface} A`;
});

app.use(router.routes()).use(router.allowedMethods);

app.listen(port, () => {
    console.log(`Server started on ${port}`);
});
