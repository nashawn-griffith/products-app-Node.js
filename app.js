const express = require('express');
const morgan = require('morgan');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const db = require('./config/config');
const exphbs = require('express-handlebars');
const products = require('./routes/products/products_routes');
const orders = require('./routes/orders/orders_routes');
const index = require('./routes/index');


//create express app
const app = express();


//set port
const port = process.env.PORT || 5000;

//connect to the database
mongoose.connect(db.mongoURI, {useNewUrlParser:true})
.then(console.log('Database running'))
.catch((error) => console.log(error));

/*middleware*/
app.use(morgan('dev'));

// Method override middleware
app.use(methodOverride('_method'));


/*session and flash middleware*/
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));

app.use(flash());


//handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//bodyparser
app.use(express.json());
app.use(express.urlencoded({extended:true}));

/*set local variables used to display
  flash messages*/
  app.use((req, res, next) =>{
     res.locals.success = req.flash('success');
     res.locals.fail = req.flash('fail');
     res.locals.fail_msg = req.flash('fail_msg');
     res.locals.error = req.flash('error');
     next();

  });

//use routes
app.use('/', index);
app.use('/products', products);
app.use('/orders', orders);



//run application
app.listen(port, () =>{
    console.log(`server running on port ${port}`);
});