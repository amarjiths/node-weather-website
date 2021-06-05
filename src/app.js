const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')


const app = express();
const port = process.env.PORT || 3000;

// public directory path
const publicDirectoryPath = path.join(__dirname, '../public');
// template path default is views folder rewiting to template folder
const viewsPath = path.join(__dirname, '../templates/views');
// partials templates - coomon templates
const partialsPath = path.join(__dirname, '../templates/partials')

// set hablebar engine
app.set('view engine', 'hbs');
// fetch the templates folder files
app.set('views', viewsPath);
// set the partials path to handlebars
hbs.registerPartials(partialsPath);

//setup static directory
app.use(express.static(publicDirectoryPath));

app.get('', (req,res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Amarjith'
    })
});

app.get('/about', (req,res) => {
    res.render('about', {
        title: 'About',
        name: 'AmarJith'
    })
});

app.get('/help', (req,res) => {
    res.render('help', {
        title: 'Help',
        name: 'Amarjith'
    })
});

app.get('/weather', (req,res) => {

    if(!req.query.address) {
        return res.send({
            error: 'Address should be provide'
        })
    }
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return console.log(error)
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return console.log(error)
            }

            console.log(location)
            console.log(forecastData)
            res.send({
                forecast: forecastData,
                location: location,
                address: req.query.address
            })
        })
    })

   
});

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'you must provide search term'
        });
    }
    console.log(req.query.search)
    res.send( {
        products: []
    })
});


app.get('/help/*', (req, res) => {
    res.render('404', {
        errorMsg: 'Help article not found',
        title: '404',
        name: 'Amarjith'
    })
});

app.get('*', (req, res) => {
    res.render('404', {
        errorMsg: 'Page Not Found',
        title: '404',
        name: 'Amarjith'
    })
});

app.listen(port, () => {
    console.log('Server running on port ' + port)
});