let userGardenSettings = {};

function tickOrUntickPlant_seperate(domId, id) {

  startLoadingSpinner("loading-progress-plant-names");

  let shouldRemove = !domId.checked;

  let request = buildPostRequest('/userGardenSettings/addOrRemovePlant', {
      plantId: id,
      shouldRemove: shouldRemove 
    });

  const plantDivParent = document.getElementById('plant-names-div');

  sendRequest(request, (result, message, data) => {
      
      stopLoadingSpinner('loading-progress-plant-names');
      console.log(result);
      console.log(message);
      console.log(data);

      if(result === "SUCCESS") {

      } else {
        plantDivParent.innerHTML = message;
      }
  
  });
}

function tickOrUntickPlant(domId, id) {

  let shouldRemove = !domId.checked;

  let indexAt = userGardenSettings.plantIds.indexOf(id);

  if(shouldRemove && indexAt >= 0) {
    userGardenSettings.plantIds.splice(indexAt, 1);
  } else if(!shouldRemove && indexAt == -1) {
    userGardenSettings.plantIds.push(id);
  }

}



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

        // document.getElementById('gps-metadata').innerHTML = userGardenSettings.longitude + ', ' + userGardenSettings.latitude;

        if(typeof(userGardenSettings.address1) !== 'undefined') {
          console.log(userGardenSettings.address1);
          document.getElementById('addrs_1').value = userGardenSettings.address1;
          document.getElementById('addrs_2').value = userGardenSettings.address2;
          document.getElementById('suburb').value = userGardenSettings.suburb;
          document.getElementById('state').value = userGardenSettings.state;
          document.getElementById('postcode').value = userGardenSettings.postcode;
        }   

        let climateIndex = 0;
        let climateString = userGardenSettings.climateRegion;

        console.log(climateString);


        if(climateString === "temperate") {
          climateIndex = 1;
        } else if(climateString === "arid") {
          climateIndex = 2;
        } else if(climateString === "semiarid") {
          climateIndex = 3;
        } else if(climateString === "subtropical") {
          climateIndex = 4;
        } else if(climateString === "tropical") {
          climateIndex = 5;
        }


        document.getElementById('select-climate-zone-id').value = climateIndex;


        // document.getElementById('gps-metadata').innerHTML = metaData.longitude + ', ' + metaData.latitude;


        stopLoadingSpinner("loading-progress");
        //NOTE: Get the plant names now
        //TODO: Maybe we want to do this async?
        getPlantNames();
       
      } else {
        plantDivParent.innerHTML = message;
      }
  
  });
} 

function saveSettings() {
    startLoadingSpinner("save-progress");

    const plantDivParent = document.getElementById('plant-names-div');

    let request = buildPostRequest('/userGardenSettings/saveSettings', userGardenSettings);

    sendRequest(request, (result, message, data) => {
        console.log(result);
        console.log(message);
        console.log(data);

        if(result === "SUCCESS") {

          stopLoadingSpinner("save-progress");

          greenTick_activate("saveTick");   


          } else {
          plantDivParent.innerHTML = message;
        }
    });
}

function getPlantNames() {

  startLoadingSpinner("loading-progress-plant-names");

	const plantDivParent = document.getElementById('plant-names-div');
  const herbDivParent = document.getElementById('herbs-names-div');
  const treeDivParent = document.getElementById('trees-names-div');

	let request = buildPostRequest('/plant/getAllCommonPlantNames', {});

	sendRequest(request, (result, message, data) => {
  		console.log(result);
  		console.log(message);
  		console.log(data);

  		if(result === "SUCCESS") {

        stopLoadingSpinner("loading-progress-plant-names");

  			data.map((plant) => {

          let isChecked = userGardenSettings.plantIds.includes(plant._id);
          let divToPlaceIn = plantDivParent;
          if(plant.Type === "herb") {
            divToPlaceIn = herbDivParent;
          } else if(plant.Type === "tree") {
            divToPlaceIn = treeDivParent;
          }

  				let parent = meta_create_plant_tick_box(divToPlaceIn, isChecked, plant._id, plant.CommonName);
  			});
  		} else {
  			plantDivParent.innerHTML = message;
  		}
	});
}


function updateClimateZone(elm) {
  greenTick_activate("climateTick");    

  let climateString = "cool";
  let indexAt = parseInt(elm.value);

  if(indexAt === 1) {
    climateString = "temperate";
  } else if(indexAt === 2) {
    climateString = "arid";
  } else if(indexAt === 3) {
    climateString = "semiarid";
  } else if(indexAt === 4) {
    climateString = "subtropical";
  } else if(indexAt === 5) {
    climateString = "tropical";
  }

  console.log(climateString);

  userGardenSettings.climateRegion = climateString;
}

function downloadAddressFinder() {

  let widget, initAddressFinder = function() {
      widget = new AddressFinder.Widget(
          document.getElementById('addrs_1'),
          'VPBR38WUEK6NY7CL4QJM',
          'AU', {
              "address_params": {
                  "gnaf": "1"
              }
          }
      );

      widget.on('result:select', function(fullAddress, metaData) {
          // You will need to update these ids to match those in your form
          document.getElementById('addrs_1').value = metaData.address_line_1;
          document.getElementById('addrs_2').value = metaData.address_line_2;
          document.getElementById('suburb').value = metaData.locality_name;
          document.getElementById('state').value = metaData.state_territory;
          document.getElementById('postcode').value = metaData.postcode;

          // document.getElementById('gps-metadata').innerHTML = metaData.longitude + ', ' + metaData.latitude;

          userGardenSettings.address1 = metaData.address_line_1;
          userGardenSettings.address2 = metaData.address_line_2;
          userGardenSettings.suburb = metaData.locality_name;
          userGardenSettings.state = metaData.state_territory;
          userGardenSettings.postcode = metaData.postcode;

          userGardenSettings.longitude = metaData.longitude;
          userGardenSettings.latitude = metaData.latitude;

          userGardenSettings.gpsSet = true;     

          greenTick_activate("locationTick");     
      });
  };

    var script = document.createElement('script');
    script.src = 'https://api.addressfinder.io/assets/v3/widget.js';
    script.async = true;
    script.onload = initAddressFinder;
    document.body.appendChild(script);
};

onFinishLoad.push(getUserSettings);


onFinishLoad.push(downloadAddressFinder);