function setErrorText(errorText) {
	var divError = document.getElementById("error");
	divError.innerText = errorText + "\n";
};

function returnError(errorText) {
	setErrorText(errorText);
	throw "";
};

var parameter,
	url,
	isError = 0;

function removeSpaces(string) {
	while (string.charAt(string.length - 1) === " ") {
		string = string.slice(0, string.length - 1);
	}

	if (string.charAt(0) === " ") {
		var temp = string.split(" ");
		string = temp[temp.length - 1];
	}

	return string;
};

function removeSkypeFormatting(string) {
	if (string.charAt(0) === "[") {
		var temp = string.split(" ");
		string = temp[temp.length - 1];
	}

	return string;
};

function openWindow() {
	window.open(url + parameter);
	window.close();
};

var list = [];

function onGot(item) {
	url = item.savedURL;

	parameter = document.getElementById("parameter").value;
	parameter = removeSpaces(parameter);
	parameter = removeSkypeFormatting(parameter);

	if (parameter === "") {
		isError = 1;
		returnError("Please insert parameter");
	} else if (url === undefined) {
		isError = 1;
		returnError("Please define URL in Options");
	} else {
		openWindow();
	}
}

function onError(item) {
	returnError("Can't get URL from Options");
}

function openURL() {
	var item = browser.storage.local.get("savedURL");
	item.then(onGot, onError);
}

function inputParameterListener(e) {
	var enter = 13;

	if (e.keyCode === enter) {
		openURL();
	}
};

function listenInputParameter(inputParameter) {
	if (inputParameter.addEventListener) {
		inputParameter.addEventListener("keydown", inputParameterListener, false);
	} else if (inputParameter.attachEvent) {
		inputParameter.attachEvent("keydown", inputParameterListener);
	}
};

function listenParameter() {
	listenInputParameter(document.getElementById("parameter"));
};

if (window.addEventListener) {
	window.addEventListener("load", this.listenParameter, false);
} else if (window.attachEvent) {
	window.attachEvent("onload", this.listenParameter);
} else {
	document.addEventListener("load", this.listenParameter, false);
}