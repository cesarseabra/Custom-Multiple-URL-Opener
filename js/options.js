function saveOptions() {
	var url = document.getElementById("urlOption").value;
	var error = document.getElementById("error");

	if (url === "") {
		error.textContent = "Please fill URL";
	} else {
		error.innerText = "";

		browser.storage.local.set({
			savedURL: url
		});
	}
}

function restoreOptions() {
	browser.storage.local.get({
		savedURL: "http://example.com?parameter="
	}, function (items) {
		document.getElementById("urlOption").value = items.savedURL;
		document.getElementById("urlOption").select();
	});
}
document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save").addEventListener("click", saveOptions);

var enter = 13;

function inputURLListener(e) {
	if (e.keyCode === enter) {
		saveOptions();
	}
}

function listenInputURL(inputURL) {
	if (inputURL.addEventListener) {
		inputURL.addEventListener("keydown", inputURLListener, false);
	} else if (inputURL.attachEvent) {
		inputURL.attachEvent("keydown", inputURLListener);
	}
}

function listenURL() {
	listenInputURL(document.getElementById("urlOption"));
}

if (window.addEventListener) {
	window.addEventListener("load", listenURL, false);
} else if (window.attachEvent) {
	window.attachEvent("onload", listenURL);
} else {
	document.addEventListener("load", listenURL, false);
}