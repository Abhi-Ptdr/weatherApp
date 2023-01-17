const express = require("express");
const https = require("https");                              //dnt have to install because it is one of the native node module which is bundeled in node modules.
const bodyParser = require("body-parser");

const app = express();                                      //initialise express app

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){

  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res){
  // console.log("post request Recieved");
  //now we hane to install body parser to look into our html body content.
  // console.log(req.body.cityName);

  const query = req.body.cityName;
  const apiKey = "f83bb631b61e2ca3e562586df38fceb1";
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q="+ query +"&appid="+ apiKey +"&units="+ unit;


  https.get(url, function(response){
    //console.log(response);    logs whole bunch of data
    console.log(response.statusCode);                       //to log specifically value of statusCode;

    response.on("data", function(data){                     //responce.on gives data in hexadecimal

      const weatherData = JSON.parse(data)                  //to convert that hexadecimal data into JSON formate. It is just opposite to the JSON.stringify(data) which convertjs objects to the string formate.
      //console.log(weatherData);
      const temperature = weatherData.main.temp              //select temp: key inside main: object from weatherData
      const weatherDiscription = weatherData.weather[0].description    //weather: [] is an array so cant use weatherData.weather.description index no. is required
      const icon = weatherData.weather[0].icon
      const imageUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
      console.log(temperature, weatherDiscription, icon);

      //res.send("<h1>The temperature in Ratlam is " + temperature + " degrees Celcius</h1>")

      res.write("<p> The weather is currently " + weatherDiscription + " </p>");
      res.write("<h1> The temperature in "+ query +" is " + temperature + " degrees Celcius.</h1>");     //we can use res.send once but res.send any no. of times
      res.write("<img src=" + imageUrl + ">");
      res.send()
    })

  })

  //res.send("server is up and running.")    cant use more then one time app.get response to send data

})



app.listen(3000, function(){
  console.log("server is running on port 3000.");
})
