import express from 'express';
import mongoose from 'mongoose';
import BodyParser from 'body-parser';
import cookieParser from 'cookie-parser'
import path from 'path';
import flash from 'connect-flash'
import jwt from 'jsonwebtoken';
import methodOverride from 'method-override';
import session from 'cookie-session'
import exphbs from 'express-handlebars'
import passport from 'passport';
import localStrategy from 'passport-local';
import passportLocalMongoose from 'passport-local-mongoose';
import User from './models/user.model';
import Admin from './models/admin.model';
import config from './config';
import appRouter from './routes/index';
const app = express();

//use flash messages
app.use(flash());
// use method override
app.use(methodOverride('_method',{ methods: ['POST', 'GET', 'PUT', 'DELETE'] }))
// parse request body content
app.use(BodyParser.urlencoded({extended: true}))
app.use(BodyParser.json());

app.use(cookieParser());

// configure passport for authentication
app.use(session({
    secret: 'I celebrate you sir',
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new localStrategy(User.authenticate()));

// set view engine to Handlebars
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views')) // this is the folder where we keep our ejs files
app.engine('handlebars', exphbs({defaultLayout: 'main'}));

// routing with imported allback functions
app.use('/', appRouter);
// serves up static files from the public folder. Anything in public/ will just be served up as the file it is
app.use(express.static(path.join(__dirname, 'public')));

// parse req variable into hbs templates
app.use((req, res, next) => {
    res.locals.flashes = req.flash()
    res.locals.user = req.user || null
    next()
});


// Don't go to any page we don't have
app.get('*', (req, res) => {
    res.status(404).render('404', {error: '404! page not found!', errorcode: 404})
});
// server initialization with databse connection
const port = process.env.PORT || 50000;

app.listen(port, () => {
    console.log(`SchoolReview  is on port ${port} 🔥🔥🔥🔥🔥🔥→ `)
    console.log(`Open your browser at http://localhost:${port}`)
    //connect to MongoDB
    mongoose.connect(config.db);
    const db = mongoose.connection;
    mongoose.Promise = global.Promise // Tell Mongoose to use ES6 promises
    //handle mongo error
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open',  () => {
    // we're connected!
    console.log('Connected successfully to database')
    });
});

export default app;