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
	getSearchTerm: function () {
		var term = $(Main.e.searchBox).val();
		if (term.trim() == '') {
			throw 'Term cannot be empty';
		}
		Main.searchTerm = term.trim();
	},
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
		}else{
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
	parseUrl: function (urlP) {
		return urlP.replace(new RegExp('{{tag}}', 'g'), Main.searchTerm);
	},
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