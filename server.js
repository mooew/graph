var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var moment = require('moment');

var Pusher = require('pusher');

var pusher = new Pusher({
    appId: '426105',
    key: '95be360cf53aab13f769',
    secret: '164a62f9ce0d2f7ad82a',
    cluster: 'eu',
   encrypted: true
});

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

var londonTempData = {
    city: 'London',
    unit: 'celsius',
    dataPoints: [
      /*
      {
        time: '11:00:00',
        temperature: 12
      },
      {
        time: '11:01:00',
        temperature: 13
      },
      {
        time: '11:02:00',
        temperature: 15
      },
      {
        time: '11:03:00',
        temperature: 14
      },
      {
        time: '11:04:00',
        temperature: 15
      },
      {
        time: '11:10:00',
        temperature: 12
      },
  */
  ]
  }

app.get('/getTemperature', function(req,res){
  res.send(londonTempData);
});

app.get('/addTemperature', function(req,res){

  var temp = parseInt(req.query.temperature);
  var time = parseInt(req.query.time);
  if(temp && time && !isNaN(temp) && !isNaN(time)){


    var newDataPoint = {
      temperature: temp,
//      time: time
      time: moment().format(' h:mm:ss ')
    };
    londonTempData.dataPoints.push(newDataPoint);         //ad new datapoint to array
    //trigger event event and send newDataPoint
    pusher.trigger('london-temp-chart', 'new-temperature', {
      dataPoint: newDataPoint
    });


    res.send({success:true});


  }else{
    res.send({success:false, errorMessage: 'Invalid Query Paramaters, required - temperature & time.'});
  }
});

app.get('/addTemperature1', function(req,res){

  var temp = parseInt(req.query.temperature);
  var time = parseInt(req.query.time);
  if(temp && time && !isNaN(temp) && !isNaN(time)){


    var newDataPoint = {
      temperature: temp,
//      time: time
      time: moment().format(' h:mm:ss ')
    };
    londonTempData.dataPoints.push(newDataPoint);         //ad new datapoint to array
    //trigger event event and send newDataPoint
    pusher.trigger('london-temp-chart', 'new-temperature1', {
      dataPoint: newDataPoint
    });


    res.send({success:true});


  }else{
    res.send({success:false, errorMessage: 'Invalid Query Paramaters, required - temperature & time.'});
  }
});


// Error Handler for 404 Pages
app.use(function(req, res, next) {
    var error404 = new Error('Route Not Found');
    error404.status = 404;
    next(error404);
});

module.exports = app;

app.listen(9000, function(){
  console.log('Example app listening on port 9000!')
});
