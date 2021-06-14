function registerUser(name, email, password, callback) {

	let request = buildPostRequest('/user/register', {
			name: name,
			email: email,
			password: password
		});

	sendRequest(request, callback)
}


function loginUser(email, password, callback) {

	let request = buildPostRequest('/user/login', {
			email: email,
			password: password
		});

	sendRequest(request, callback)
}


function isLoggedIn(callback) {
	let request = buildPostRequest('/user/isLoggedIn', {});
	sendRequest(request, callback);
}

function logout(callback) {
	let request = buildPostRequest('/user/logout', {});
	sendRequest(request, callback);
}

function logoutUser() {
	let request = buildPostRequest('/user/logout', {});
	sendRequest(request, (result, message, data) => {
		if(result === "SUCCESS") {
			if(typeof isUserArea === 'undefined') {
				clearNavBar();
				makeNonUserNavBar();
			} else if(isUserArea) {
				window.location = ('/login.html');
			}
		} else {
			window.alert("ERROR: couldn't log out");
		}
	});
}
