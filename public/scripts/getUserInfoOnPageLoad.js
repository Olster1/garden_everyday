let userData = {}; 
let onFinishLoad = [];

///////////////////////************ Our api *************////////////////////

function makeUserNavBar() {
  let navList = document.getElementById('my-navbar-id');

  let li = document.createElement("li");

  li.innerHTML = "<a href=\"javascript:logoutUser();\">Logout</a></li>;"; 
  
  navList.appendChild(li);
}

function makeNonUserNavBar() {
  let navList = document.getElementById('my-navbar-id');

  let li0 = document.createElement("li");
  li0.innerHTML = "<a href=\"/register\">Register</a>";
  navList.appendChild(li0);

  let li1 = document.createElement("li");
  li1.innerHTML = "<a href=\"/login\">Login</a>";
  navList.appendChild(li1);
}

function clearNavBar() {
    let navList = document.getElementById('my-navbar-id');
    navList.innerHTML = "";
}

function processOnLoadFunctions() {
  onFinishLoad.map((func) => {
    func();
  });
}

function startLoadingSpinner(divName) {
  const loadingDiv = document.getElementById(divName);
  loadingDiv.innerHTML = "<div class='loader'></div>";

}

function stopLoadingSpinner(divName) {
  const loadingDiv = document.getElementById(divName);
  loadingDiv.innerHTML = "";

}

document.body.onload = (event) => {
  	let request = buildPostRequest('/user/isLoggedIn', {});

  	sendRequest(request, (result, message, data) => {
  		
  		// document.getElementById('email-loading-progress').innerHTML = message;
  		console.log(result);
  		console.log(message);
  		console.log(data);

  		let loggedIn = true;
  		if(result === "ERROR" || result === "FAILED") {
  			loggedIn = false;
  		}
  		  
      user = data;

      onLoadAddInlineVariables();

      if(typeof isUserArea === 'undefined') {
        //NOTE: Let the user look at the page
        document.getElementById('main-page').style.display = "block";
        document.getElementById('main-page-loader').style.display = "none";

        if(loggedIn) { makeUserNavBar(); }
        if(!loggedIn) { makeNonUserNavBar(); }

        processOnLoadFunctions();

      } else {

    		if(isUserArea && !loggedIn)  {
    			routerGoTo('/login');
    		} else if(loggedIn) {
    			
    			if(!isUserArea) {
    				routerGoTo('/user');
    			} else {
    				document.getElementById('main-page').style.display = "block";
    				document.getElementById('main-page-loader').style.display = "none";

            //NOTE: Logged in nav bar
            makeUserNavBar();

            processOnLoadFunctions();
    			}
    		} else {
          //NOTE: Non Logged in nav bar
    			document.getElementById('main-page').style.display = "block";
    			document.getElementById('main-page-loader').style.display = "none";

          makeNonUserNavBar();

          processOnLoadFunctions();
    		}
      }	
  	});
};



