
import * as express from "express";
import { join } from "path";
import * as favicon from "serve-favicon";
import { json, urlencoded } from "body-parser";
import { protectedRouter } from "./routes/protected";
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var BearerStrategy  = require('passport-http-bearer').Strategy;
var mongoose = require('mongoose');
var api = require('./routes/api');
var user = require('./routes/user');
var exp = require('./routes/experiences');
var passport = require('passport');
var image = require('./routes/image');
var session = require('express-session');
var busboy = require('connect-busboy');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash    = require('connect-flash');
var checkout = require('./routes/checkout');
var braintree = require('braintree');
//var parsexml = require('./routes/parsexml');
const app: express.Application = express();
app.disable("x-powered-by");

app.use(favicon(join(__dirname, "../public", "favicon.ico")));
app.use(express.static(join(__dirname, '../public')));
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms

// app.use(json());
app.use(urlencoded({ extended: true }));
app.use(busboy());

// Mongoose connection to MongoDB (ted/ted is readonly)
mongoose.connect('mongodb://localhost/testDB', function(error) {
    if (error) {
        console.log(error);
    }
    
});
// configuration ===============================================================
require('./config/passport')(passport); // pass passport for configuration


// api routes
app.use("/api", api);
app.use('/user',user);
app.use("/exp", exp);
app.use('/image',image);
app.use('/', checkout);
//app.use('/parse',parsexml);

app.use('/client', express.static(join(__dirname, '../client')));

// error handlers
// development error handler
// will print stacktrace
if (app.get("env") === "development") {

    app.use(express.static(join(__dirname, '../node_modules')));

    app.use(function(err, req: express.Request, res: express.Response, next: express.NextFunction) {
        res.status(err.status || 500);
        res.json({
            error: err,
            message: err.message
        });
    });
}

app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
require('./routes/routes.js')(app, passport);

/*
// catch 404 and forward to error handler
app.use(function(req: express.Request, res: express.Response, next) {
    let err = new Error("Not Found");
    next(err);
});
// production error handler
// no stacktrace leaked to user
app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(err.status || 500);
    res.json({
        error: {},
        message: err.message
    });
});
*/

export { app }
