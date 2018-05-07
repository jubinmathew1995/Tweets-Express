// App setup
console.log('App setup');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var exphbs  = require('express-handlebars');
var session = require('express-session');
var app = express();
const db_url = require('./config');

// Handlebars setup
console.log('Handlebars setup');
var hbs =  exphbs.create({
    defaultLayout: 'main',
    extname: '.handlebars',
    partialsDir: 'views/common/'
});
app.engine('.handlebars', hbs.engine);
app.set('view engine', '.handlebars');

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(function(request, response, next){
    next();
});

//session
app.use(session({
    secret:'helloiajwdfhkolaewihrl',
    resave:true,
    saveUninitialized:false
}));

//MongoDB database server configuration running
mongoose.connect(DATABASE_URL);
var db=mongoose.connection;
db.on('error',  console.error.bind(console,'connecting error '));
db.once('open',function(){
    console.log("Connected to mongodb database");
});
var USER = mongoose.model('users',{
    name: String,
    email: String,
    password: String
});
var TWEET = mongoose.model('tweets',{
    name: String,
    content: String
});


//routing setup
app.get('/',function(request,response){
    if(request.session.user) {
        TWEET.find({}, function (err, tt) {
            var temp1 = new Array(tt.length);
            var temp = new Array(tt.length);
            for(var i=0;i<tt.length;i++){
                temp.push({name:tt[i].name,content:tt[i].content});
            }
            //console.log(temp);
            var rev=temp.reverse();
            response.render('home',{name: request.session.user.name,tweet:rev});
        });
    }
    else
        response.render('home');
});

app.get('/mytweet',function(request,response){
    if(request.session.user) {
        TWEET.find({name: request.session.user.name}, function (err, tt) {
            var temp = new Array(tt.length);
            for(var i=0;i<tt.length;i++)
                temp.push(tt[i].content);
            //console.log(temp);
            response.render('mytweet',{msg: 'you are logged in ',name: request.session.user.name,tweet:temp.reverse()});
        });
    }
    else
        response.render('home');
});
app.get('/about',function(request,response){
    if(request.session.user)
        response.render('about',{name: request.session.user.name});
    else
        response.render('about');
});

app.get('/signup',function(request,response){
    if(request.session.user)
        response.render('signup',{name: request.session.user.name});
    else
        response.render('signup');
});
app.post('/signup', function (request,response) {
    //console.log(request.body);
    USER.findOne({name : request.body.name},function(error, result) {
        if (error) {
            throw error;
        }
        else {
            if (result) {
                response.render('signup',{msg: 'Username already existing'});;
            }
            else{
                var x = new USER({
                    name:request.body.name,
                    email:request.body.email,
                    password:request.body.password
                });
                x.save(function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('new user data saved in database.');
                    }
                });
                response.redirect('/login');
            }
        }
    });
});

app.get('/login',function(request,response){
    response.render('login');
});

app.post('/login',function(request,response){
    //console.log(request.body);
    USER.findOne({name : request.body.name,password: request.body.password},function(error, result) {
        if (error) {
            throw error;
        }
        else {
            if (result) {
                request.session.user=result;
                // response.redirect('/');
                TWEET.find({}, function (err, tt) {
                    var temp1 = new Array(tt.length);
                    var temp = new Array(tt.length);
                    for(var i=0;i<tt.length;i++){
                        temp.push({name:tt[i].name,content:tt[i].content});
                    }
                    //console.log(temp);
                    var rev=temp.reverse();
                    response.render('home',{msg: 'you are logged in ',name: request.session.user.name,tweet:rev});
                });
            }
            else
                response.render('login',{msg: 'Invalid username and password'});;

        }
    });
});
app.get('/tweet',function(request,response){
    if(request.session.user)
        response.render('tweet',{name: request.session.user.name});
    else
        response.render('tweet');
});
app.post('/tweet',function (request,response) {
    if(request.session.user){
        if(request.body.tweet){
            //console.log(request.body);
            var temp = new TWEET({
                name:request.session.user.name,
                content:request.body.tweet
            });
            temp.save(function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('new TWEET data saved in database.');
                }
            });
        }
        response.redirect('/');
    }
});
app.get('/logout',function(request,response){
    request.session.destroy(function(err){
        response.redirect('/');
    });
});

// Boot server
console.log('Boot server');
var server = app.listen(3000, function(){
    console.log('Server running at port 3000');
});