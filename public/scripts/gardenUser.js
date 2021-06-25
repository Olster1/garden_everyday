
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

function checkWeather(lat, long) {

  let request = buildGetRequest('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&appid=3a83cfadb21fb56f624d7136e09551b0');

  sendRequest(request, (weatherData) => {
      

      let iconImg = 'http://openweathermap.org/img/wn/' + weatherData.weather[0].icon + '@2x.png';
      const warningsDivParent = document.getElementById('warnings');
      meta_create_weatherDashboard(warningsDivParent, (weatherData.main.temp - 273).toFixed(2), iconImg);
  }, 1);
  

}

onFinishLoad.push(getUserSettings);