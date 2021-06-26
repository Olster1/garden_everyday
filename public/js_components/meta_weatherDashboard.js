function meta_create_weatherDashboard(parentDiv, temperature, suburb, weatherIconStr, rainfall) {

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
element2.appendChild(document.createTextNode(" "));
element2.appendChild(document.createTextNode("in"));
element2.appendChild(document.createTextNode(" "));
element2.appendChild(document.createTextNode(suburb));
element2.appendChild(document.createTextNode(" "));

let element3 = document.createElement('img');
element3.src = weatherIconStr;
element2.appendChild(element3);

let element4 = document.createElement('p');
element1.appendChild(element4);
element4.appendChild(document.createTextNode("The"));
element4.appendChild(document.createTextNode(" "));
element4.appendChild(document.createTextNode("predicted"));
element4.appendChild(document.createTextNode(" "));
element4.appendChild(document.createTextNode("rainfall"));
element4.appendChild(document.createTextNode(" "));
element4.appendChild(document.createTextNode("today"));
element4.appendChild(document.createTextNode(" "));
element4.appendChild(document.createTextNode("is"));
element4.appendChild(document.createTextNode(" "));
element4.appendChild(document.createTextNode(rainfall));
element4.appendChild(document.createTextNode(" "));
element4.appendChild(document.createTextNode("millimeters"));

let element5 = document.createElement('canvas');
element5.id = "rainfallChart";
element5.style.width = '100%';
element5.style.maxWidth = '700px';
element1.appendChild(element5);

let element6 = document.createElement('p');
element6.id = "totalRainfall-id";
element1.appendChild(element6);

return element1;
}
