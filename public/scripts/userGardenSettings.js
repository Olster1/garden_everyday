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

        document.getElementById('gps-metadata').innerHTML = userGardenSettings.longitude + ', ' + userGardenSettings.latitude;

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

          } else {
          plantDivParent.innerHTML = message;
        }
    });
}

function getPlantNames() {

  startLoadingSpinner("loading-progress-plant-names");

	const plantDivParent = document.getElementById('plant-names-div');

	let request = buildPostRequest('/plant/getAllCommonPlantNames', {});

	sendRequest(request, (result, message, data) => {
  		console.log(result);
  		console.log(message);
  		console.log(data);

  		if(result === "SUCCESS") {

        stopLoadingSpinner("loading-progress-plant-names");

  			data.map((plant) => {
          // console.log(plant._id);
          // console.log(plant.CommonName);
          let isChecked = userGardenSettings.plantIds.includes(plant._id);
  				let parent = meta_create_plant_tick_box(plantDivParent, isChecked, plant._id, plant.CommonName);
  			});
  		} else {
  			plantDivParent.innerHTML = message;
  		}
	});
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

          document.getElementById('gps-metadata').innerHTML = metaData.longitude + ', ' + metaData.latitude;

          userGardenSettings.longitude = metaData.longitude;
          userGardenSettings.latitude = metaData.latitude;

          userGardenSettings.gpsSet = true;          
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