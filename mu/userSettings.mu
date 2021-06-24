#CARD
#TITLE Where and What are you gardening {user.name}?
#HR
##Where?
#HTML
<div id="location-div">
<img src='/images/AustralianClimateZoneMap.png'>
</div>
<div class='row'>
	<div class='location-form-details col-md-6'>
		<div class="form-header">Address Line 1</div>
		<input type="search" class="form-input" id="addrs_1" placeholder="Search address here..."></input>

		<div class="form-header">Address Line 2</div>
		<input type="text" class="form-input" id="addrs_2"></input>

		<div class="form-header">Suburb</div>
		<input type="text" class="form-input" id="suburb"></input>

		<div class="form-header">State</div>
		<input class="form-input" id="state"></input>

		<div class="form-header">Postcode</div>
		<input class="form-input" id="postcode"></input>
	</div>
	<div class='col-md-6 location-form-details' id='gps-metadata'>
	</div>
</div
#ENDHTML

#BR
#HR 

##What?
#HTML
<div id="plant-names-div" class='row'></div>
#ENDHTML
#DIV loading-progress-plant-names 
#DIV loading-progress 


#BR
#BR
#BUTTON saveSettings() Save
#DIV save-progress 


#JAVASCRIPT isUserArea
#JAVASCRIPT userGardenSettings