"use strict";
var express = require("express");
var path_1 = require("path");
var favicon = require("serve-favicon");
var body_parser_1 = require("body-parser");
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
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
var flash = require('connect-flash');
var checkout = require('./routes/checkout');
var braintree = require('braintree');
//var parsexml = require('./routes/parsexml');
var app = express();
exports.app = app;
app.disable("x-powered-by");
app.use(favicon(path_1.join(__dirname, "../public", "favicon.ico")));
app.use(express.static(path_1.join(__dirname, '../public')));
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
// app.use(json());
app.use(body_parser_1.urlencoded({ extended: true }));
app.use(busboy());
// Mongoose connection to MongoDB (ted/ted is readonly)
mongoose.connect('mongodb://localhost/testDB', function (error) {
    if (error) {
        console.log(error);
    }
});
// configuration ===============================================================
require('./config/passport')(passport); // pass passport for configuration
// api routes
app.use("/api", api);
app.use('/user', user);
app.use("/exp", exp);
app.use('/image', image);
app.use('/', checkout);
//app.use('/parse',parsexml);
app.use('/client', express.static(path_1.join(__dirname, '../client')));
// error handlers
// development error handler
// will print stacktrace
if (app.get("env") === "development") {
    app.use(express.static(path_1.join(__dirname, '../node_modules')));
    app.use(function (err, req, res, next) {
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
//# sourceMappingURL=app.js.map