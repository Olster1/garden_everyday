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

let element7 = document.createElement('br');
element1.appendChild(element7);

let element8 = document.createElement('a');
element8.id = "reveal-future-data";
element1.appendChild(element8);
element8.appendChild(document.createTextNode("See"));
element8.appendChild(document.createTextNode(" "));
element8.appendChild(document.createTextNode("Next"));
element8.appendChild(document.createTextNode(" "));
element8.appendChild(document.createTextNode("Five"));
element8.appendChild(document.createTextNode(" "));
element8.appendChild(document.createTextNode("Days"));
element8.appendChild(document.createTextNode(" "));
element8.appendChild(document.createTextNode("Weather"));
element8.appendChild(document.createTextNode(" "));
element8.appendChild(document.createTextNode("🔎"));

let element9 = document.createElement('div');
element9.id = "future-rainfall-data";
element9.style.display = 'none';
element1.appendChild(element9);

let element10 = document.createElement('canvas');
element10.id = "futureRainfallChart";
element10.style.width = '100%';
element10.style.maxWidth = '700px';
element9.appendChild(element10);

let element11 = document.createElement('br');
element9.appendChild(element11);

let element12 = document.createElement('br');
element9.appendChild(element12);

let element13 = document.createElement('canvas');
element13.id = "futureCloudChart";
element13.style.width = '100%';
element13.style.maxWidth = '700px';
element9.appendChild(element13);

let element14 = document.createElement('hr');
element1.appendChild(element14);

let element15 = document.createElement('a');
element15.id = "reveal-past-data";
element1.appendChild(element15);
element15.appendChild(document.createTextNode("See"));
element15.appendChild(document.createTextNode(" "));
element15.appendChild(document.createTextNode("Last"));
element15.appendChild(document.createTextNode(" "));
element15.appendChild(document.createTextNode("Five"));
element15.appendChild(document.createTextNode(" "));
element15.appendChild(document.createTextNode("Days"));
element15.appendChild(document.createTextNode(" "));
element15.appendChild(document.createTextNode("Weather"));
element15.appendChild(document.createTextNode(" "));
element15.appendChild(document.createTextNode("🔎"));

let element16 = document.createElement('div');
element16.id = "previous-rainfall-data";
element16.style.display = 'none';
element1.appendChild(element16);

let element17 = document.createElement('p');
element17.id = "totalRainfall-id";
element16.appendChild(element17);

let element18 = document.createElement('canvas');
element18.id = "rainfallChart";
element18.style.width = '100%';
element18.style.maxWidth = '700px';
element16.appendChild(element18);

let element19 = document.createElement('br');
element16.appendChild(element19);

let element20 = document.createElement('br');
element16.appendChild(element20);

let element21 = document.createElement('canvas');
element21.id = "cloudChart";
element21.style.width = '100%';
element21.style.maxWidth = '700px';
element16.appendChild(element21);

let element22 = document.createElement('hr');
element1.appendChild(element22);

return element1;
}
