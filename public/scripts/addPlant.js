function AddPlant() {

	let common_name_input = document.getElementById('common_name_input').value;
	let latin_name_input = document.getElementById('latin_name_input').value;
	let prop_method_name_input = document.getElementById('prop_method_name_input').value;
	
	let cool_year_to_plant_input = document.getElementById('cool_year_to_plant_input').value;
	let med_year_to_plant_input = document.getElementById('med_year_to_plant_input').value;
	let sub_trop_year_to_plant_input = document.getElementById('sub_trop_year_to_plant_input').value;
	let trop_year_to_plant_input = document.getElementById('trop_year_to_plant_input').value;

	let plantType = "vegetable";

	let typeIndex = document.getElementById('plant_type_dropdown').value;

	if(typeIndex === 1) {
		plantType = "herb";
	} else if(typeIndex === 2) {
		plantType = "tree";
	}

  	startLoadingSpinner('loading-progress');

	const goalDivParent = document.getElementById('goals');

	let request = buildPostRequest('/plant/createPlant', {
			CommonName: common_name_input,
			LatinName: latin_name_input,
			PropagationMethod: prop_method_name_input,
			type: plantType,
			TimeOfYearToPlant: { cool: cool_year_to_plant_input, mediterranean: med_year_to_plant_input, subTropical: sub_trop_year_to_plant_input, tropical: trop_year_to_plant_input },
		});

	sendRequest(request, (result, message, data) => {
  		
  		stopLoadingSpinner('loading-progress');
  		console.log(result);
  		console.log(message);
  		console.log(data);

  		if(result === "SUCCESS") {
  		}
  	});

}
