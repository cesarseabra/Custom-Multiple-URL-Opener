var Main = {
	e: {
		searchBox: '#searchBox',
		searchBtn: '#searchBtn',
		errorSection: '.error',
		errorBtn: '#errorBtn',
	},
	dbKey: 'urlList',
	searchTerm: null,
	errors: [],
	/**
	 * Init function, here are declared all the events related to the buttons and inputs.
	 *
	 */
	init: function () {
		$(Main.e.searchBtn).click(function (e) {
			e.preventDefault();
			try {
				Main.setSearchState('off');
				Main.getSearchTerm();
				Main.getUrlList();
			} catch (error) {} finally {
				Main.setSearchState('on');
				$(Main.e.searchBox).val('');
			}
		});

		$(Main.e.searchBox).on('keypress', function (e) {
			if (e.which === 13) {
				try {
					Main.setSearchState('off');
					Main.getSearchTerm();
					Main.getUrlList();
				} catch (error) {} finally {
					Main.setSearchState('on');
					$(this).val('');
				}
			}
		});
	},
	/**
	 * Sets the search term typed by the user in the input box.
	 * @throws - if the input is empty
	 *
	 */
	getSearchTerm: function () {
		var term = $(Main.e.searchBox).val();
		if (term.trim() == '') {
			throw 'Term cannot be empty';
		}
		Main.searchTerm = term.trim();
	},
	/**
	 * Starts the entire operation. Gets the list of URL of the user from the local storage. 
	 * Sends the user a notification if the items could not be retrieved from the DB.
	 *
	 */
	getUrlList: function () {
		Main.errors = [];
		browser.storage.local.get(Main.dbKey)
			.then(function (item) {
				Main.openUrls(item.urlList);
			}, function (error) {
				browser.notifications.create('get-err-notification', {
					"type": "basic",
					"iconUrl": browser.extension.getURL("icons/error.png"),
					"title": "Error!",
					"message": "Could not retrieve the URL list from the DB."
				});
			});
	},
	/**
	 * At the end of the operation verifies if any error was generated when opening the URL list. 
	 * If errors where present, send the user an final error message with the URLs of the link that 
	 * didn't open successfully. If no errors where present send the user a success message.
	 *
	 */
	setError: function () {
		console.log('SET ERROR');
		var message;
		var icon;
		var title;
		if (Main.errors.length > 0) {
			title = 'Error!';
			icon = 'icons/error.png';
			message = "The following errors ocurred:";
			for (let i = 0; i < Main.errors.length; i++) {
				const elem = Main.errors[i];
				message += `\n${elem.msg}`;
			}
		} else {
			title = 'Success!';
			icon = 'icons/success.png';
			message = 'All URLs where opened successfully!';
		}

		browser.notifications.create('open-err-notification', {
			"type": "basic",
			"iconUrl": browser.extension.getURL(icon),
			"title": title,
			"message": message
		});
	},
	/**
	 * Opens a new tab with a given URL. Return the Promise created by the tab creating method.
	 *
	 * @param {string} urlP - the URL to open in the new tab
	 * @returns {Promise} - the Promise created by the tab creation method
	 */
	openNewTab: function (urlP) {
		var tabV = browser.tabs.create({
			url: urlP
		});
		tabV.then(function (param) {

		}, function (error) {
			Main.errors.push({
				type: 'storageGet',
				msg: `Could not open the URL: ${urlP}`,
				error: error
			});
		});

		return tabV;
	},
	/**
	 * Opens all the URL present in the URL list. Captures all the Promises created by the opening tab method and
	 * waits for them all to present the user the final message.
	 *
	 * @param {Array[string]} urlList - the list with all the URLs to open
	 */
	openUrls: function (urlList) {
		var promises = [];
		for (let i = 0; i < urlList.length; i++) {
			const defLink = Main.parseUrl(urlList[i]);
			promises.push(Main.openNewTab(defLink));
		}

		console.log('promises: ', promises);

		Promise.all(promises).then(function (values) {
			Main.setError();
		});
	},
	/**
	 * Takes the passed URL with the tag '{{tag}}' and replaces it with the searching term defined by the user.
	 * 
	 * @returns {string} - the parsed URL 
	 */
	parseUrl: function (urlP) {
		return urlP.replace(new RegExp('{{tag}}', 'g'), Main.searchTerm);
	},
	/**
	 * Changes the state of the input box and button to prevent multiple searches at the same time.
	 *
	 * @param {string} state - the state of the search box and button. Accepts 'on' or 'off'(Default)
	 */
	setSearchState: function (state) {
		switch (state) {
			case 'on':
				$(Main.e.searchBox).prop('disabled', false);
				$(Main.e.searchBtn).prop('disabled', false);
				break;
			default: // off
				$(Main.e.searchBox).prop('disabled', true);
				$(Main.e.searchBtn).prop('disabled', true);
				break;
		}
	}
}

$(function () {
	Main.init();
});