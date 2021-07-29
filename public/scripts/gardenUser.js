
// function buildGoalUi(name, objective, complete, created_at) {
// 	let goalDiv = document.createElement("div");
// 	goalDiv.classList.add("rounded-card");
// 	goalDiv.innerHTML = "<div class='row'><div class='col-sm-8'>" + name + '<br>' + objective + '<br>' +  complete + '<br>' +  created_at + "</div><div class='col-sm-4' style='text-align: right;'><button style='border: none; background-color: transparent;'><img style='width: 0.7cm;' src='./images/close.png'></button></div></div>";
// 	return goalDiv;
// }


let goalElms = {};
let userGardenSettings = {};
let userPlantInfos = {};

function getUserSettings() {

  startLoadingSpinner("loading-progress");

  const userDivParent = document.getElementById('user-error-message');

  let request = buildPostRequest('/userGardenSettings/getUserSettings', {});

  sendRequest(request, (result, message, data) => {
      console.log(result);
      console.log(message);
      console.log(data);

      stopLoadingSpinner("loading-progress");

      if(result === "SUCCESS") {

        //NOTE: Assign the user data
        userGardenSettings = data;
        

        if(userGardenSettings.gpsSet) {
          checkWeather(userGardenSettings.latitude, userGardenSettings.longitude);  
        }


        getPlantInfos(userGardenSettings.plantIds);
       
      } else {
        userDivParent.innerHTML = message;
      }
  
  });
} 

function getPlantInfos(infosArray) {
  startLoadingSpinner("loading-progress");

  const userDivParent = document.getElementById('user-error-message');

  let request = buildPostRequest('/plant/getPlantsFromIds', { ids: userGardenSettings.plantIds});

  sendRequest(request, (result, message, data) => {
      console.log(result);
      console.log(message);
      console.log(data);

      stopLoadingSpinner("loading-progress");

      if(result === "SUCCESS") {

        userPlantInfos = data;

        //NOTE: Output all the plant info
        const climateRegion = userGardenSettings.climateRegion;

        data.map((plant) => {

        });

      } else {
        userDivParent.innerHTML = message;
      }
  
  });
}


let nextFiveDaysRainFall = [0, 0, 0, 0, 0, 0];
let frostDays = [false, false, false, false, false, false];
let nextFiveDaysCloudCover = [0, 0, 0, 0, 0, 0];
let lastFiveDaysCloudCover = [0, 0, 0, 0, 0];
let lastFiveDaysRainFall = [0, 0, 0, 0, 0];
let lastFiveDaysCloudCover_color = ["yellow", "yellow", "yellow", "yellow", "yellow"];
let callbackCount = 0;

function checkCallBackDone() {
  if(callbackCount == 6) {
    //finsihed

    //NOTE: Create previous rainfall chart
    
    let xValues = ["Yesterday", "2 Days Ago", "3 Days Ago", "4 Days Ago", "5 Days Ago"];
    let yValues = lastFiveDaysRainFall;
    let barColors = ["#D96731", "#D96731","#D96731","#D96731","#D96731"];

    new Chart("rainfallChart", {
      type: "bar",
      data: {
        labels: xValues,
        datasets: [{
          backgroundColor: barColors,
          data: yValues
        }]
      },
      options: {
        legend: {display: false},
        title: {
          display: true,
          text: "Previous 5 day rainfall in millimeters"
        }
      }
    });

    //NOTE: Zero is the initial value
    let totalRainFall = lastFiveDaysRainFall.reduce((a, b) => a + b, 0);


    let totalRainDiv = document.getElementById('totalRainfall-id');
    totalRainDiv.innerHTML = '<b>' + totalRainFall.toFixed(2) + "</b> millimeters Total Rain Fall for the previous last 5 days."
    console.log(totalRainFall);

    ////////////////////////////////////


    //NOTE: Create previous cloud chart

    xValues = ["Yesterday", "2 Days Ago", "3 Days Ago", "4 Days Ago", "5 Days Ago"];
    yValues = lastFiveDaysCloudCover;
    barColors = ["#D96731", "#D96731","#D96731","#D96731","#D96731"];

    new Chart("cloudChart", {
      type: "bar",
      data: {
        labels: xValues,
        datasets: [{
          backgroundColor: barColors,
          data: yValues
        }]
      },
      options: {
        legend: {display: false},
        title: {
          display: true,
          text: "Previous 5 day average cloud cover in %"
        },
        scales: {
          yAxes: [{
                  display: true,
                  scaleLabel: {
                      display: true,
                      labelString: 'Cloud Percent (%)'
                  },
                  ticks: {
                      beginAtZero: true,
                      steps: 10,
                      max: 100
                  }
              }]
        }
      }
    });


    

    ///////////////////////////////////////////

  }
}

function getWeatherForPreviousFiveDays(lat, long) {
  const millsecondsPerDay = 1000*60*60*24;
  let thisTime = new Date();

  for(let dayIndex = 0; dayIndex < 5; ++dayIndex) {
    thisTime -= millsecondsPerDay;
    const time = ~~(+thisTime / 1000); //Converts from millseconds to seconds

    const timeMachine = "https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=" + lat + "&lon=" + long +  "&dt=" + time + "&appid=3a83cfadb21fb56f624d7136e09551b0";

    let request = buildGetRequest(timeMachine);

    sendRequest(request, (weatherData) => {

        let totalMillimeters = 0;
        let totalCloudPercent = 0;
        let dayCount = 0;

        //NOTE: Loop through the hours 
        for(let hourIndex = 0; hourIndex < 24; ++hourIndex) {
          // console.log(weatherData);
          if(typeof(weatherData.hourly[hourIndex].rain) !== 'undefined') {
              let rainMM = weatherData.hourly[hourIndex].rain['1h'];
              // console.log(rainMM);
              totalMillimeters += rainMM;
          }

          //NOTE: To calculate the average
          

          //NOTE: Get the cloud cover
          if(typeof(weatherData.hourly[hourIndex].clouds) !== 'undefined') {
              let cloudPercent = weatherData.hourly[hourIndex].clouds;
              // console.log(rainMM);
              totalCloudPercent += cloudPercent;
              dayCount++;
          }
        }

        // console.log(weatherData);
        lastFiveDaysRainFall[dayIndex] = totalMillimeters;
        lastFiveDaysCloudCover[dayIndex] = (totalCloudPercent / dayCount);

        let cloudVal = lastFiveDaysCloudCover[dayIndex];
        // let color = rgba(255, 0, 0, 1);

        // if(cloudVal >= 11 && cloudVal < 25) {
        //   color = rgba(255, 0, 0, 0.2);
        // } else if(cloudVal >= 25 && cloudVal < 50) {

        // } else if(cloudVal >= 50 && cloudVal < 85) {

        // } else if(cloudVal >= 85 && cloudVal < 100) {

        // }



        // lastFiveDaysCloudCover_color[dayIndex] = color;

        callbackCount++;

        checkCallBackDone();

    }, 1);
  }
}

function checkWeather(lat, long) {

  // NOTE: OLD one that didn't have forecast or previous days
  // let request = buildGetRequest('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&appid=3a83cfadb21fb56f624d7136e09551b0');
  let request = buildGetRequest('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + long + '&appid=3a83cfadb21fb56f624d7136e09551b0');

 

  //NOTE: For 5 days get the weather data we need
  getWeatherForPreviousFiveDays(lat, long);
  
 
  sendRequest(request, (weatherData) => {

      let iconImg = 'http://openweathermap.org/img/wn/' + weatherData.current.weather[0].icon + '@2x.png';
      const warningsDivParent = document.getElementById('warnings');

      console.log(weatherData);

      let rainfall = 0;

      if(typeof(weatherData.daily[0].rain) !== 'undefined') {
        rainfall = weatherData.daily[0].rain;
      }


      for(let dayIndex = 0; dayIndex < 6; ++dayIndex) {
          if(typeof(weatherData.daily[dayIndex].rain) !== 'undefined') {
            nextFiveDaysRainFall[dayIndex] = weatherData.daily[dayIndex].rain;
          }

          if(typeof(weatherData.daily[dayIndex].clouds) !== 'undefined') {
            nextFiveDaysCloudCover[dayIndex] = weatherData.daily[dayIndex].clouds;
          }

          let cloudCover = nextFiveDaysCloudCover[dayIndex];

          let rainfall = nextFiveDaysRainFall[dayIndex];

          let temp = 100;

          if(typeof(weatherData.daily[dayIndex].temp) !== 'undefined') {
            temp = weatherData.daily[dayIndex].temp.min - 273.0;
          }

          //cloud percentage < 10% , no rain, below 5 degrees
          if(cloudCover < 0.1 && rainfall < 1 && temp < 5) {
            frostDays[dayIndex] = true;
          }         
      }


      let today = weatherData.daily[0];

      // today.moon_phase - plant by moon phase
      // today.pressure
      // today.rain
      // today.dew_point
      // today.humidity
      // today.pop
      // wind_deg: 149
      // wind_gust: 7.26
      // wind_speed: 5.01

      // temp:
      // day: 295.1
      // eve: 294.71
      // max: 295.55
      // min: 293.94
      // morn: 294.01
      // night: 294.24
 
      let suburb = userGardenSettings.suburb;
      meta_create_weatherDashboard(warningsDivParent, (weatherData.current.temp - 273).toFixed(2), suburb, iconImg, rainfall.toFixed(2));

      callbackCount++;
      console.log("created dashboard");
      /////////////////////////////
      checkCallBackDone();

      //RAIN FALL 

      let xValues = ["Today", "Tomorrow", "2 Days From Now", "3 Days From Now", "4 Days From Now", "5 Days From Now"];
      let yValues = nextFiveDaysRainFall;
      let barColors = ["#ffff99", "#ffff99","#ffff99","#ffff99","#ffff99", "#ffff99"];

      new Chart("futureRainfallChart", {
        type: "bar",
        data: {
          labels: xValues,
          datasets: [{
            backgroundColor: barColors,
            data: yValues
          }]
        },
        options: {
          legend: {display: false},
          title: {
            display: true,
            text: "Next 6 day rainfall in millimeters"
          },
          scales: {
            yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Rainfall (mm)'
                    },
                }]
          }
        }
      });


      ////////////////////////////////////


      //NOTE: CLOUDS

      xValues = ["Today", "Tomorrow", "2 Days From Now", "3 Days From Now", "4 Days From Now", "5 Days From Now"];
      yValues = nextFiveDaysCloudCover;
      

      new Chart("futureCloudChart", {
        type: "bar",
        data: {
          labels: xValues,
          datasets: [{
            backgroundColor: barColors,
            data: yValues
          }]
        },
        options: {
          legend: {display: false},
          title: {
            display: true,
            text: "Next 6 day average cloud cover in %"
          },
          scales: {
            yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Cloud Percent (%)'
                    },
                    ticks: {
                        beginAtZero: true,
                        steps: 10,
                        max: 100
                    }
                }]
          }
        }
      });

      ///////////////////////////////////////////

      frostDays.map((day, index) => {
        if(day) {
          meta_create_frost_warning(warningsDivParent, index);
        }
      });


  }, 1);




}

onFinishLoad.push(getUserSettings);