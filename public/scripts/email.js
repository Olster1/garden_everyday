///////////////////////************ Our api *************////////////////////
function testEmail() {
	let emailTo = document.getElementById('email_input').value;

	let request = buildPostRequest('/add_to_email_list', {
			emailTo: emailTo
		});

	document.getElementById('email-loading-progress').innerHTML = "<div class='loader'></div>";
	

	sendRequest(request, (result, message, data) => {
		document.getElementById('email-loading-progress').innerHTML = message;
		console.log(result);
		console.log(message);
		console.log(data);
	});
}
