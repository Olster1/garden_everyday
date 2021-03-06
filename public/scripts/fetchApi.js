///////////////////////*********** Helper functions **************////////////////////

function handle500Error(response) {
	if(!response.ok) {
		console.log(response);
		throw Error("Server error");
	}

	return response;
}

function buildPostRequest(url, data) {
	const myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	

	const request = new Request(url, {
		method: 'POST',
		body: JSON.stringify(data), 
		headers: myHeaders

	});

	return request;
}

function buildGetRequest(url) {
	const myHeaders = new Headers();
	
	const request = new Request(url, {
		method: 'GET',
		mode: 'cors',
		headers: myHeaders

	});

	return request;
}


function sendRequest(request, callback, dataCount) {
	fetch(request)
	.then(handle500Error)
	.then((resp) => resp.json())
	.then((data) => {
		// console.log(data);
		if(dataCount === 1) {
			callback(data);	
		} else {
			callback(data.result, data.message, data.data);	
		}
		
	}).catch((error) => {
		console.log(error);
		callback("ERROR", "Server error", {});
	});
}

function routerGoTo(location) {
	window.location = location;
}