var Options = {
	e: {
		clearAllBtn: '#clearAllBtn',
		addBtn: '#addBtn',
		urlSection: '.url-section',
		inputSection: '.input-section',
		urlInput: '.url-input',
		urlDelete: '.url-delete',
		saveBtn: '#saveBtn',
		messageSection: '.message-section',
		message: '.message'
	},
	urlList: [],
	dbUrlList: [],
	dbKey: 'urlList',
	defaultUrl: 'https://www.google.com/search?q={{tag}}',
	init: function () {
		Options.restoreOptions();

		$(Options.e.saveBtn).click(Options.saveOptions);

		$(Options.e.clearAllBtn).click(Options.clearAll);

		$(Options.e.addBtn).click(function (e) {
			Options.addUrl('');
		});

		$('body').on('click', Options.e.urlDelete, function () {
			Options.deleteUrl($(this));
		});
	},
	restoreOptions: function () {
		browser.storage.local.get(Options.dbKey)
			.then(function (item) {
				var list = item.urlList;
				if (list.length == 0) {
					Options.addUrl(Options.defaultUrl);
				} else {
					for (let i = 0; i < list.length; i++) {
						Options.dbUrlList.push(list[i]);
						Options.addUrl(list[i]);
					}
				}
			}, function (error) {
				Options.setMessage('Could not retrieve saved URLs.', 'error');
			});
	},
	saveOptions: function () {
		Options.clearMessages();
		Options.getAllUrl();

		if (_.xor(Options.urlList, Options.dbUrlList).length == 0) {
			Options.setMessage('No alterations where made. Content not saved!', 'warning');
			throw "No alterations where made!";
		}

		browser.storage.local.set({
				urlList: Options.urlList
			})
			.then(function (item) {
				console.log('SET OK: ', item)
				Options.setMessage('Urls saved successfully.', 'success');
			}, function (error) {
				console.log('SET ERROR: ', error);
				Options.setMessage('Error while saving the URL list.', 'error');
			});
	},
	clearAll: function () {
		if (window.confirm("Do you really want to delete all the Urls?")) {
			$(Options.e.inputSection).remove();
		}
	},
	addUrl: function (urlP) {
		$(Options.e.urlSection).append(Proto.urlInput(urlP));
	},
	deleteUrl: function (e) {
		e.closest(Options.e.inputSection).remove();
	},
	checkEmpty: function (urlP) {
		var u = urlP.trim();
		var u2 = urlP.replace('http://', '');
		var u3 = urlP.replace('https://', '');
		if (u == '') {
			return true;
		}
		if (u2.trim() == '') {
			return true;
		}
		if (u3.trim() == '') {
			return true;
		}
		return false;
	},
	checkIsUrl: function (urlP) {

		if (urlP.indexOf("http://") == 0 || urlP.indexOf("https://") == 0) {
			return true;
		}

		return false;
	},
	setMessage: function (message, type) {
		var messageSection = $(Options.e.messageSection);
		switch (type) {
			case 'success':
				messageSection.append(Proto.successMessage(message));
				break;
			case 'warning':
				messageSection.append(Proto.warningMessage(message));
				break;
			case 'error':
				messageSection.append(Proto.errorMessage(message));
				break;
			default:
				break;
		}
	},
	clearMessages: function () {
		$(Options.e.messageSection).empty();
	},
	validateUrl: function (urlP) {
		if (Options.checkEmpty(urlP)) {
			Options.setMessage('One of the inputs is empty!', 'error');
			throw "";
		}

		if (!Options.checkIsUrl(urlP)) {
			Options.setMessage(`The URL: ${urlP} is missing the http://`, 'error');
			throw "";
		}
	},
	getAllUrl: function () {
		Options.urlList = [];
		$(Options.e.urlInput).each(function () {
			var urlP = $(this).val();
			Options.validateUrl(urlP);
			Options.urlList.push(urlP);
		});
	}
}

$(function () {
	Options.init();
});