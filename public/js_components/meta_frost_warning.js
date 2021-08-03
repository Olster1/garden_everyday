function meta_create_frost_warning(parentDiv, index) {

let element1 = document.createElement('div');
element1.classList.add("frost-warning");
parentDiv.appendChild(element1);

let element2 = document.createElement('h3');
element1.appendChild(element2);

let element3 = document.createElement('b');
element2.appendChild(element3);
element3.appendChild(document.createTextNode("Warning"));
element3.appendChild(document.createTextNode(":"));
element3.appendChild(document.createTextNode("Frost"));
element3.appendChild(document.createTextNode(" "));
element3.appendChild(document.createTextNode("❄️"));

let element4 = document.createElement('p');
element1.appendChild(element4);
element4.appendChild(document.createTextNode(index));
element4.appendChild(document.createTextNode(" "));
element4.appendChild(document.createTextNode("days"));
element4.appendChild(document.createTextNode(" "));
element4.appendChild(document.createTextNode("from"));
element4.appendChild(document.createTextNode(" "));
element4.appendChild(document.createTextNode("now"));
element4.appendChild(document.createTextNode(" "));
element4.appendChild(document.createTextNode("there"));
element4.appendChild(document.createTextNode(" "));
element4.appendChild(document.createTextNode("will"));
element4.appendChild(document.createTextNode(" "));
element4.appendChild(document.createTextNode("be"));
element4.appendChild(document.createTextNode(" "));
element4.appendChild(document.createTextNode("frost."));
element4.appendChild(document.createTextNode(" "));
element4.appendChild(document.createTextNode("Cover"));
element4.appendChild(document.createTextNode(" "));
element4.appendChild(document.createTextNode("your"));
element4.appendChild(document.createTextNode(" "));
element4.appendChild(document.createTextNode("vegetables"));
element4.appendChild(document.createTextNode(" "));
element4.appendChild(document.createTextNode("with"));
element4.appendChild(document.createTextNode(" "));
element4.appendChild(document.createTextNode("a"));
element4.appendChild(document.createTextNode(" "));
element4.appendChild(document.createTextNode("cover."));

let element5 = document.createElement('p');
element1.appendChild(element5);
element5.appendChild(document.createTextNode("This"));
element5.appendChild(document.createTextNode(" "));
element5.appendChild(document.createTextNode("could"));
element5.appendChild(document.createTextNode(" "));
element5.appendChild(document.createTextNode("be"));
element5.appendChild(document.createTextNode(" "));
element5.appendChild(document.createTextNode("a"));
element5.appendChild(document.createTextNode(" "));
element5.appendChild(document.createTextNode("glass"));
element5.appendChild(document.createTextNode(" "));
element5.appendChild(document.createTextNode("pane"));
element5.appendChild(document.createTextNode(" "));
element5.appendChild(document.createTextNode("or"));
element5.appendChild(document.createTextNode(" "));
element5.appendChild(document.createTextNode("cloth."));
element5.appendChild(document.createTextNode(" "));

return element1;
}
