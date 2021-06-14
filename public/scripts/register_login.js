function register() {
	let name = document.getElementById('name_input').value;
	let email = document.getElementById('email_input').value;
	let password = document.getElementById('password_input').value;

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
			routerGoTo('/user');
		}
	});
}