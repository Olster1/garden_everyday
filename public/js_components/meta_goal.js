function meta_create_goal(parentDiv, name, objective, complete, created_at, goalId) {

let element1 = document.createElement('div');
element1.classList.add("rounded-card");
parentDiv.appendChild(element1);

let element2 = document.createElement('div');
element2.classList.add("row");
element1.appendChild(element2);

let element3 = document.createElement('div');
element3.classList.add("col-sm-8");
element2.appendChild(element3);
element3.appendChild(document.createTextNode("My"));
element3.appendChild(document.createTextNode(" "));
element3.appendChild(document.createTextNode("Name"));
element3.appendChild(document.createTextNode(" "));
element3.appendChild(document.createTextNode("is"));
element3.appendChild(document.createTextNode(" "));
element3.appendChild(document.createTextNode(name));

let element4 = document.createElement('br');
element3.appendChild(element4);
element3.appendChild(document.createTextNode(objective));

let element5 = document.createElement('br');
element3.appendChild(element5);
element3.appendChild(document.createTextNode(complete));

let element6 = document.createElement('br');
element3.appendChild(element6);
element3.appendChild(document.createTextNode(created_at));

let element7 = document.createElement('div');
element7.classList.add("col-sm-4");
element7.style.textAlign = 'right';
element2.appendChild(element7);

let element8 = document.createElement('button');
element8.addEventListener("click", function() { deleteGoal(goalId) });
element8.style.border = 'none';
element8.style.backgroundColor = 'transparent';
element7.appendChild(element8);

let element9 = document.createElement('img');
element9.src = "./images/close.png";
element9.style.width = '0.7cm';
element8.appendChild(element9);

return element1;
}
