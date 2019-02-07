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

		$('body').on('click', Main.e.errorBtn, function () {
			if (window.confirm("Do you really want to delete all the Urls?")) {

			}
		});

		//Todo missing event listener for err button -> persistent listener
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
				Main.errors.push({
					type: 'storage_get',
					msg: 'Could not retrieve stored links.',
					error: error
				});
			});
	},
	setError: function () {
		if (errors.length > 0) {
			$(Main.e.errorSection).append(Proto.errorBtn());
		}
	},
	openNewTab: function (urlP) {
		var creating = browser.tabs.create({
			url: urlP
		});
		creating.then(function (param) {
			console.log(`OPEN OK: ${urlP}`);
		}, function (error) {
			Main.errors.push({
				type: 'storageGet',
				msg: `Could not open the URL: ${urlP}`,
				error: error
			});
		});
	},
	openUrls: function (urlList) {
		for (let i = 0; i < urlList.length; i++) {
			const defLink = Main.parseUrl(urlList[i]);
			console.log('defLink: ', defLink);
			Main.openNewTab(defLink);
		}
		Main.setError();
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