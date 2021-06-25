function meta_create_weatherDashboard(parentDiv, temperature, weatherIconStr) {

let element1 = document.createElement('div');
parentDiv.appendChild(element1);

let element2 = document.createElement('p');
element1.appendChild(element2);
element2.appendChild(document.createTextNode("It"));
element2.appendChild(document.createTextNode("'"));
element2.appendChild(document.createTextNode("s"));
element2.appendChild(document.createTextNode(" "));
element2.appendChild(document.createTextNode(temperature));
element2.appendChild(document.createTextNode(" "));
element2.appendChild(document.createTextNode("degrees"));
element2.appendChild(document.createTextNode(" "));
element2.appendChild(document.createTextNode("celcius"));
element2.appendChild(document.createTextNode(" "));
element2.appendChild(document.createTextNode("today"));

let element3 = document.createElement('img');
element3.src = weatherIconStr;
element2.appendChild(element3);

return element1;
}
