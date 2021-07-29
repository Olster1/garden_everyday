function meta_create_weatherDashboard(parentDiv, temperature, suburb, weatherIconStr, rainfall) {

let element1 = document.createElement('div');
parentDiv.appendChild(element1);

let element2 = document.createElement('p');
element1.appendChild(element2);
element2.appendChild(document.createTextNode("It"));
element2.appendChild(document.createTextNode("'"));
element2.appendChild(document.createTextNode("s"));
element2.appendChild(document.createTextNode(" "));

let element3 = document.createElement('b');
element2.appendChild(element3);
element3.appendChild(document.createTextNode(temperature));
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

let element4 = document.createElement('img');
element4.src = weatherIconStr;
element2.appendChild(element4);

let element5 = document.createElement('p');
element1.appendChild(element5);
element5.appendChild(document.createTextNode("The"));
element5.appendChild(document.createTextNode(" "));
element5.appendChild(document.createTextNode("predicted"));
element5.appendChild(document.createTextNode(" "));
element5.appendChild(document.createTextNode("rainfall"));
element5.appendChild(document.createTextNode(" "));
element5.appendChild(document.createTextNode("today"));
element5.appendChild(document.createTextNode(" "));
element5.appendChild(document.createTextNode("is"));
element5.appendChild(document.createTextNode(" "));

let element6 = document.createElement('b');
element5.appendChild(element6);
element6.appendChild(document.createTextNode(rainfall));
element5.appendChild(document.createTextNode(" "));
element5.appendChild(document.createTextNode("millimeters"));

let element7 = document.createElement('canvas');
element7.id = "rainfallChart";
element7.style.width = '100%';
element7.style.maxWidth = '700px';
element1.appendChild(element7);

let element8 = document.createElement('p');
element8.id = "totalRainfall-id";
element1.appendChild(element8);

let element9 = document.createElement('canvas');
element9.id = "cloudChart";
element9.style.width = '100%';
element9.style.maxWidth = '700px';
element1.appendChild(element9);

let element10 = document.createElement('ul');
element1.appendChild(element10);

let element11 = document.createElement('li');
element10.appendChild(element11);
element11.appendChild(document.createTextNode("few"));
element11.appendChild(document.createTextNode(" "));
element11.appendChild(document.createTextNode("clouds"));
element11.appendChild(document.createTextNode(":"));
element11.appendChild(document.createTextNode(" "));
element11.appendChild(document.createTextNode("11"));
element11.appendChild(document.createTextNode("-25"));
element11.appendChild(document.createTextNode("%"));

let element12 = document.createElement('li');
element10.appendChild(element12);
element12.appendChild(document.createTextNode("scattered"));
element12.appendChild(document.createTextNode(" "));
element12.appendChild(document.createTextNode("clouds"));
element12.appendChild(document.createTextNode(":"));
element12.appendChild(document.createTextNode(" "));
element12.appendChild(document.createTextNode("25"));
element12.appendChild(document.createTextNode("-50"));
element12.appendChild(document.createTextNode("%"));

let element13 = document.createElement('li');
element10.appendChild(element13);
element13.appendChild(document.createTextNode("broken"));
element13.appendChild(document.createTextNode(" "));
element13.appendChild(document.createTextNode("clouds"));
element13.appendChild(document.createTextNode(":"));
element13.appendChild(document.createTextNode(" "));
element13.appendChild(document.createTextNode("51"));
element13.appendChild(document.createTextNode("-84"));
element13.appendChild(document.createTextNode("%"));

let element14 = document.createElement('li');
element10.appendChild(element14);
element14.appendChild(document.createTextNode("overcast"));
element14.appendChild(document.createTextNode(" "));
element14.appendChild(document.createTextNode("clouds"));
element14.appendChild(document.createTextNode(":"));
element14.appendChild(document.createTextNode(" "));
element14.appendChild(document.createTextNode("85"));
element14.appendChild(document.createTextNode("-100"));
element14.appendChild(document.createTextNode("%"));

let element15 = document.createElement('canvas');
element15.id = "futureRainfallChart";
element15.style.width = '100%';
element15.style.maxWidth = '700px';
element1.appendChild(element15);

let element16 = document.createElement('canvas');
element16.id = "futureCloudChart";
element16.style.width = '100%';
element16.style.maxWidth = '700px';
element1.appendChild(element16);

return element1;
}
