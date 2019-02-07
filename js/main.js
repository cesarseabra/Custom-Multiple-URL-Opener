var Main = {
	e: {
		searchBox: '#searchBox',
		searchBtn: '#searchBtn',
		errorSection: '.error',
		errorBtn: '#errorBtn',
	},
	dbKey: 'urlList',
	errors: [],
	init: function () {
		$(Main.e.searchBtn).click(function (e) {
			e.preventDefault();
			Main.setSearchState('off');
			Main.getUrlList();
			Main.setSearchState('on');
			$(Main.e.searchBox).val('');
		});

		$(Main.e.searchBox).on('keypress', function (e) {
			if (e.which === 13) {
				Main.setSearchState('off');
				Main.getUrlList();
				Main.setSearchState('on');
				$(this).val('');
			}
		});

		$('body').on('click', Main.e.errorBtn, function () {
			if (window.confirm("Do you really want to delete all the Urls?")) {

			}
		});

		//Todo missing event listener for err button -> persistent listener
	},
	getSearchTerm: function (param) {
		var term = $(Main.e.searchBox).val();
		if (term.trim() == '') {
			throw '';
		}
		return term.trim();
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
		}, function (param) {
			Main.errors.push({
				type: 'storageGet',
				msg: 'Could not retrieve stored links.',
				error: error
			});
		});
	},
	openUrls: function (urlList) {
		for (let i = 0; i < urlList.length; i++) {
			const defLink = Main.parseUrl(urlList[i]);
			Main.openNewTab(defLink);
		}
		Main.setError();
	},
	parseUrl: function (urlP) {
		var term = Main.getSearchTerm();
		return urlP.replace(new RegExp('{{term}}', 'g'), term);
	},
	setSearchState: function (state) {
		switch (state) {
			case 'on':
				$(Main.e.searchBox).attr("disabled", "disabled");
				$(Main.e.searchBtn).attr("disabled", "disabled");
				break;
			default: // off
				$(Main.e.searchBox).removeAttr("disabled");
				$(Main.e.searchBtn).removeAttr("disabled");
				break;
		}
	}
}

$(function () {
	Main.init();
});