
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var UserRoutes = require('./routes/user');
var pass = require('./routes/pass');
var http = require('http');
var path = require('path');
// OAuthの為にpassportを読み込む
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var app = express();
var server = http.createServer(app);


var url = '';
//socket.io
var io = require('socket.io');
io = io.listen(server);
io.set('log level', 2);

var userRoutes = new UserRoutes(io);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(require('stylus').middleware({ src: __dirname + '/public' }));
app.use(express.favicon());
// app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({secret: 'fy11'}));
// passportのinitializeとsessionを使う
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

if('development' == app.get('env')){
	// development only
	app.use(express.errorHandler());
	url = 'http://fy11-dev.cloudapp.net';
}
if('production' == app.get('env')){
	// production only
	url = 'http://fy11.cloudapp.net';
}

app.get('/', routes.index);
app.get('/checkin', routes.checkin);
app.get('/archive', routes.archive);
app.get('/pass', pass.get);


app.get('/getUser', userRoutes.get);
app.post('/registerUser', userRoutes.register);
app.post('/addPushToken', userRoutes.addPushToken);
app.get('/acceptUser', userRoutes.accept);
app.delete('/deleteUser', userRoutes.delete);

server.listen(app.get('port'), function(){
	console.log('NODE_ENV: ' + app.get('env'));
	console.log('Express server listening on port ' + app.get('port'));
});

// セッションをシリアライズ、デシリアライズ
passport.serializeUser(function(user, done){
	// console.log('se :' + JSON.stringify(user));
	done(null, user);
});
passport.deserializeUser(function(obj, done){
	// console.log('de : ' + JSON.stringify(obj));
    done(null, obj);
});

var FACEBOOK_APP_ID = '558681050879750';
var FACEBOOK_APP_SECRET = 'bb3996eb9460ba35c9465ffce601c14f';
passport.use(
	new FacebookStrategy({
		clientID: FACEBOOK_APP_ID,
		clientSecret: FACEBOOK_APP_SECRET,
		callbackURL: url + '/auth/facebook/callback'
	},function(accessToken, refreshToken, profile, done){
		// console.log('at: ' + JSON.stringify(accessToken));
		// console.log('rt: ' + JSON.stringify(refreshToken));
		// console.log('pf: ' + JSON.stringify(profile));
		process.nextTick(function(){
			done(null ,profile);
		});
	})
);

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {failureRedirect: '/'}), function(req, res){
	res.redirect('/');
});

app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});


