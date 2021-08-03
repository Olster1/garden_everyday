function addEnterKeyInput() {
	let name_r = document.getElementById('name_input_register');
	let email_r = document.getElementById('email_input_register');
	let password_r = document.getElementById('password_input_register');

	if(name_r !== null) {
		addEnterListenerRegister(name_r);
	}

	if(email_r !== null) {
		addEnterListenerRegister(email_r);
	}

	if(password_r !== null) {
		addEnterListenerRegister(password_r);
	}

	let name_l = document.getElementById('name_input');
	let email_l = document.getElementById('email_input');
	let password_l = document.getElementById('password_input');

	if(name_l !== null) {
		addEnterListenerLogin(name_l);
	}

	if(email_l !== null) {
		addEnterListenerLogin(email_l);
	}

	if(password_l !== null) {
		addEnterListenerLogin(password_l);
	}
}

function addEnterListenerLogin(input) {

	input.addEventListener("keyup", function(event) {
	  // Number 13 is the "Enter" key on the keyboard
	  if (event.keyCode === 13) {
	    // Cancel the default action, if needed
	    event.preventDefault();

	    // Trigger the button element with a click
	    login();
	  }
	});
}

function addEnterListenerRegister(input) {
	input.addEventListener("keyup", function(event) {
	  // Number 13 is the "Enter" key on the keyboard
	  if (event.keyCode === 13) {
	    // Cancel the default action, if needed
	    event.preventDefault();
	    // Trigger the button element with a click
	    register();
	  }
	});
}


function register() {
	let name = document.getElementById('name_input_register').value;
	let email = document.getElementById('email_input_register').value;
	let password = document.getElementById('password_input_register').value;

	const loadingDiv = document.getElementById('loading-progress');

	loadingDiv.innerHTML = "<div class='loader'></div>";
	
	registerUser(name, email, password, (result, message, data) => {
		loadingDiv.innerHTML = "";

		if(result === "ERROR" || result === "FAILED") {
			loadingDiv.innerHTML = message;
		} else {
			routerGoTo('/verify-after-register');
		}
	});
}

function login() {
	let email = document.getElementById('email_input').value;
	let password = document.getElementById('password_input').value;

	const loadingDiv = document.getElementById('loading-progress');

	loadingDiv.innerHTML = "<div class='loader'></div>";
	
	loginUser(email, password, (result, message, data) => {
		

		if(result === "ERROR" || result === "FAILED") {
			loadingDiv.innerHTML = message;
		} else {
			if(!data.userSetup || data.userSetup === 'undefined') {
				//NOTE: Prompt user to set up their profile
				routerGoTo('/userSettings');
			} else {
				routerGoTo('/user');	
			}
			
		}
	});
}

onFinishLoad.push(addEnterKeyInput);