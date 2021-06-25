
#CARD
#TITLE Create Plant

####Common Name

#INPUT common_name_input text margin-left: 0; margin-right: 0;

####Latin Name

#INPUT latin_name_input text margin-left: 0; margin-right: 0;

####Propagation Method

#INPUT prop_method_name_input text margin-left: 0; margin-right: 0;

###Time Of Year To Plant

###Cool
#INPUT cool_year_to_plant_input text margin-left: 0; margin-right: 0;

###Mediteranean
#INPUT med_year_to_plant_input text margin-left: 0; margin-right: 0;

###Sub Tropical
#INPUT sub_trop_year_to_plant_input text margin-left: 0; margin-right: 0;

###Tropical
#INPUT trop_year_to_plant_input text margin-left: 0; margin-right: 0;

#HTML
<h3>Plant Type</h3>
<select id='plant_type_dropdown' class="form-select" aria-label="Default select example">
  <option value="0" selected>Vegetable</option>
  <option value="1">Herb</option>
  <option value="2">Tree</option>
</select>

#ENDHTML

#DIV loading-progress 

#BUTTON AddPlant() Add Plant

#JAVASCRIPT addPlant