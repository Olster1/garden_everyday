#CARD
#TITLE Where and What are you gardening {user.name}?
#HR
##Where are you Gardening?
#BR
#HTML
<div id="location-div">
<img style='width: 100%;' src='/images/Australian-Climate-Map.jpg'>

<ul>
<li><strong><img loading="lazy" title="Australian Climate Guide" src="https://www.gardenexpress.com.au/wp-content/uploads/2014/08/climate_tropical.gif" alt="Australian Climate Guide" width="15" height="10"> Tropical</strong> – hot humid summer .</li>
<li><strong><img loading="lazy" title="Australian Climate Guide" src="https://www.gardenexpress.com.au/wp-content/uploads/2014/08/climate_mild-tropical.gif" alt="Australian Climate Guide" width="15" height="10"> Sub Tropical</strong> – warm humid summer</li>
<li><strong><img loading="lazy" title="Australian Climate Guide" src="https://www.gardenexpress.com.au/wp-content/uploads/2014/08/climate_semi-arid.gif" alt="Australian Climate Guide" width="15" height="10"> Semi-arid</strong> – hot dry summer, cold winter</li>
<li><strong><img loading="lazy" title="Australian Climate Guide" src="https://www.gardenexpress.com.au/wp-content/uploads/2014/08/climate_arid.gif" alt="Australian Climate Guide" width="15" height="10"> Arid</strong> – hot dry summer, cold winter</li>
<li><strong><img loading="lazy" title="Australian Climate Guide" src="https://www.gardenexpress.com.au/wp-content/uploads/2014/08/climate_temperate.gif" alt="Australian Climate Guide" width="15" height="10"> Temperate</strong> – warm summer, cool winter</li>
<li><strong><img loading="lazy" title="Australian Climate Guide" src="https://www.gardenexpress.com.au/wp-content/uploads/2014/08/climate_cool.gif" alt="Australian Climate Guide" width="15" height="10"> Cool</strong> – mild-warm summer, cool winter</li>
</ul>
#ENDHTML

#BR
###Australian Climate Guide

Using the map above, establish which coloured region you will be growing in. This map is intended as a guide only as climatic conditions vary between specific locations. Factors such as local altitude, wind and the proximity of hills, mountains and bodies of water can cause variations from the generalised climate map. Based on your local conditions, make an appropriate choice of what climate you're growing in. Note also that although a plant may be listed as suitable for a particular region, it may still require protection from extremes such as frost, strong winds and extreme heat.

Remember that you can often extend the range of plants that you can grow by creating micro-climates within your garden. Planting under trees, beside brick walls or in the shelter of a building, on high or low points in the garden can all have an effect. Even planting by a pond or surrounded by rocks can be used to advantage.

#HTML
</div>
<div class='row'>
	<div class='location-form-details col-md-6'>
	<h3>What climate are you gardening in?</h3>
	<p>This will be used to suggest when to propagate, plant and pick the plants you want to grow</p>
	<select id='select-climate-zone-id' class="form-select" aria-label="Default select example" onchange="updateClimateZone(this)">
	  <option value="0" selected>Cool</option>
	  <option value="1">Temperate</option>
	  <option value="2">Arid</option>
	  <option value="3">Semi-arid</option>
	  <option value="4">Sub-Tropical</option>
	  <option value="5">Tropical</option>
	</select>
#ENDHTML
#GREEN_TICK climateTick
#HTML
	</div>
	<div class='location-form-details col-md-6'>
		<h3>Where is your garden?</h3>
		<p>This will be used to warn you of any weather events that might affect your garden like frost or lack of rain. If you don't add this, you won't get any weather notifications.</p>
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

		#ENDHTML
		#GREEN_TICK locationTick
		#HTML
	</div>

	
</div
#ENDHTML
#BR
#BR
#HR 

##What do you want to grow?
###Vegetables
#HTML
<div id="plant-names-div" class='row'></div>
#ENDHTML
###Herbs
#HTML
<div id="herbs-names-div" class='row'></div>
#ENDHTML
###Fruit and Nut trees
#HTML
<div id="trees-names-div" class='row'></div>
#ENDHTML
#DIV loading-progress-plant-names 
#DIV loading-progress 


#BR
#BR
#HTML
<div class='row'>
<div class='col-md-6'>
#ENDHTML

#BUTTON saveSettings() Save
#GREEN_TICK saveTick
#DIV save-progress 

#HTML
</div>
<div class='col-md-6'>
#ENDHTML


#BUTTON settings_goToUserDashboard() Get Gardening! →

#HTML
</div>
</div>
#ENDHTML

#JAVASCRIPT isUserArea
#JAVASCRIPT userGardenSettings