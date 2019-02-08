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
	/**
	 * Init function, here are declared all the events related to the buttons and inputs.
	 *
	 */
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
	/**
	 * Restores the URL list with the list saved by the user in the local storage.
	 *
	 */
	restoreOptions: function () {
		browser.storage.local.get(Options.dbKey)
			.then(function (item) {
				var list = item.urlList;
				if (!list || list.length == 0) {
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
	/**
	 * Saves the URL present in the page in the local storage. 
	 * First checks if any new changes where
	 * made, if not sends a warning message and doesn't make a 
	 * unnecessary action in the local storage.
	 *
	 */
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
	/**
	 * Asks the user if he wants to clear all the URL from the list. 
	 * If yes cleans it. This action doesn't save anything in the local storage.
	 *
	 */
	clearAll: function () {
		if (window.confirm("Do you really want to delete all the Urls?")) {
			Options.clearMessages();
			$(Options.e.inputSection).remove();
		}
	},
	/**
	 * Adds a new URL input to the list.
	 *
	 * @param {string} urlP - the default URL to present in the list
	 */
	addUrl: function (urlP) {
		Options.clearMessages();
		$(Options.e.urlSection).append(Proto.urlInput(urlP));
	},
	/**
	 * Deletes a URL input occurrence.
	 *
	 * @param {HTMLElement} e - the delete button
	 */
	deleteUrl: function (e) {
		Options.clearMessages();
		e.closest(Options.e.inputSection).remove();
	},
	/**
	 * Checks if a determined URL is empty. Checks by trimming it and by stripping the http:// and https:// headers 
	 * and trimming again for validation.
	 * @param {string} urlP - the URL to check if is empty
	 * @returns {boolean} - true if is empty, false otherwise
	 */
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
	/**
	 * Only check if a URL has the http:// or https:// headers.
	 * @param {string} urlP - the URL to check if is a URL
	 * @returns {boolean} - true if it is, false otherwise
	 */
	checkIsUrl: function (urlP) {

		if (urlP.indexOf("http://") == 0 || urlP.indexOf("https://") == 0) {
			return true;
		}

		return false;
	},
	/**
	 * Sets a new message in the message board to inform the user of the operations. 
	 * It accepts a message and a type (success, warning or error).
	 *
	 * @param {string} message - the message to present
	 * @param {string} type - the type of the message (success, warning or error)
	 */
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
	/**
	 * Clears all the messages present in the message board.
	 *
	 */
	clearMessages: function () {
		$(Options.e.messageSection).empty();
	},
	/**
	 * Validates if the URL passes all the constraints.
	 *
	 * @param {string} urlP - the URL to validate
	 * @throws an error if the URL is empty or does not have an http header
	 */
	validateUrl: function (urlP) {
		if (Options.checkEmpty(urlP)) {
			Options.setMessage('One of the inputs is empty!', 'error');
			throw "URL cannot be empty";
		}

		if (!Options.checkIsUrl(urlP)) {
			Options.setMessage(`The URL: ${urlP} is missing the http://`, 'error');
			throw "URL must have http:// header";
		}
	},
	/**
	 * Returns all the URL present in the list defined by the user and validates them.
	 *
	 */
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