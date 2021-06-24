function meta_create_plant_tick_box(parentDiv, isChecked, plantId, plantName) {

let element1 = document.createElement('div');
element1.classList.add("col-lg-3");
element1.classList.add("col-md-3");
element1.classList.add("col-sm-3");
parentDiv.appendChild(element1);

let element2 = document.createElement('input');
element2.checked = isChecked;
element2.setAttribute('type',"checkbox");
element2.addEventListener("click", function() { tickOrUntickPlant(this, plantId) });
element1.appendChild(element2);
element1.appendChild(document.createTextNode(" "));

let element3 = document.createElement('label');
element1.appendChild(element3);
element3.appendChild(document.createTextNode(plantName));

let element4 = document.createElement('br');
element1.appendChild(element4);

return element1;
}
