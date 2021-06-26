
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


let lastFiveDaysRainFall = [0, 0, 0, 0, 0];
let callbackCount = 0;

function checkCallBackDone() {
  if(callbackCount == 6) {
    //finsihed

    //NOTE: Create previous rainfall chart
    
    let xValues = ["Yesterday", "2 Days Ago", "3 Days Ago", "4 Days Ago", "5 Days Ago"];
    let yValues = lastFiveDaysRainFall;
    let barColors = ["blue", "blue","blue","blue","blue"];

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
    totalRainDiv.textContent = totalRainFall + "mm Total Rain Fall for the previous last 5 days."
    console.log(totalRainFall);

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

        //NOTE: Loop through the hours 
        for(let hourIndex = 0; hourIndex < 24; ++hourIndex) {
          // console.log(weatherData);
          if(typeof(weatherData.hourly[hourIndex].rain) !== 'undefined') {
              let rainMM = weatherData.hourly[hourIndex].rain['1h'];
              // console.log(rainMM);
              totalMillimeters += rainMM;
          }
        }

        lastFiveDaysRainFall[dayIndex] = totalMillimeters;

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

      let suburb = userGardenSettings.suburb;
      meta_create_weatherDashboard(warningsDivParent, (weatherData.current.temp - 273).toFixed(2), suburb, iconImg, weatherData.daily[0].rain);

      callbackCount++;
      console.log("created dashboard");
      /////////////////////////////
      checkCallBackDone();


  }, 1);
  

}

onFinishLoad.push(getUserSettings);