
// function buildGoalUi(name, objective, complete, created_at) {
// 	let goalDiv = document.createElement("div");
// 	goalDiv.classList.add("rounded-card");
// 	goalDiv.innerHTML = "<div class='row'><div class='col-sm-8'>" + name + '<br>' + objective + '<br>' +  complete + '<br>' +  created_at + "</div><div class='col-sm-4' style='text-align: right;'><button style='border: none; background-color: transparent;'><img style='width: 0.7cm;' src='./images/close.png'></button></div></div>";
// 	return goalDiv;
// }


let goalElms = {};
let userGardenSettings = {};

function getUserSettings() {

  startLoadingSpinner("loading-progress");

  const plantDivParent = document.getElementById('plant-names-div');

  let request = buildPostRequest('/userGardenSettings/getUserSettings', {});

  sendRequest(request, (result, message, data) => {
      console.log(result);
      console.log(message);
      console.log(data);

      if(result === "SUCCESS") {

        //NOTE: Assign the user data
        userGardenSettings = data;
        stopLoadingSpinner("loading-progress");

        if(userGardenSettings.gpsSet) {
          checkWeather(userGardenSettings.latitude, userGardenSettings.longitude);  
        }
       
      } else {
        plantDivParent.innerHTML = message;
      }
  
  });
} 

function createGoal() {

	let name = document.getElementById('name_input').value;
	let objective = document.getElementById('objective_input').value;

  startLoadingSpinner('loading-progress');

	const goalDivParent = document.getElementById('goals');

	let request = buildPostRequest('/goal/createGoal', {
			name: name,
			objective: objective,
		});

	sendRequest(request, (result, message, data) => {
  		
  		stopLoadingSpinner('loading-progress');
  		console.log(result);
  		console.log(message);
  		console.log(data);

  		if(result === "SUCCESS") {
  			let parent = meta_create_goal(goalDivParent, data.name, data.objective, data.complete, data.created_at, data._id);
        goalElms[data._id] = parent;
        console.log(goalElms);
  		}

	
	});

}

function deleteGoal(goalId) {
  console.log(goalId);

  startLoadingSpinner("loading-progress-goals");
  
  const goalDivParent = document.getElementById('goals');

  let request = buildPostRequest('/goal/deleteGoal', {
    goalId: goalId
  });

  sendRequest(request, (result, message, data) => {
      console.log(result);
      console.log(message);
      console.log(data);

      if(result === "SUCCESS") {

        stopLoadingSpinner("loading-progress-goals");

        //NOTE: Remove VIEW from DOM
        goalElms[goalId].remove();

        delete goalElms[goalId];
        console.log(goalElms);

      } else {
        goalDivParent.innerHTML = message;
      }
  });
}



function getGoalsForUser() {

  startLoadingSpinner("loading-progress-goals");

	const goalDivParent = document.getElementById('goals');

	let request = buildPostRequest('/goal/getGoals', {});

	sendRequest(request, (result, message, data) => {
  		console.log(result);
  		console.log(message);
  		console.log(data);

  		if(result === "SUCCESS") {

        stopLoadingSpinner("loading-progress-goals");

  			data.map((goal) => {
  				let parent = meta_create_goal(goalDivParent, goal.name, goal.objective, goal.complete, goal.created_at, goal._id);
          goalElms[goal._id] = parent;
          console.log(goalElms);
  			});
  		} else {
  			goalDivParent.innerHTML = message;
  		}
  		
	
	});
}

function checkWeather(lat, long) {

  let request = buildGetRequest('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&appid=3a83cfadb21fb56f624d7136e09551b0');

  sendRequest(request, (data) => {
    console.log(data);
      const warningsDivParent = document.getElementById('warnings');
      warningsDivParent.innerHTML = "It's " + (data.main.temp - 273).toFixed(2) + " degrees celcius today";
  }, 1);
  

}


onFinishLoad.push(getGoalsForUser);
onFinishLoad.push(getUserSettings);