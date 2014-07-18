(function (global) {
	
	var blog = global.blog || {};


	blog.init = function ($) {
		var that = this;
		$.getJson('/data/search.json', function (data) {
			that.searchData = data.index || [];
		});
	};
})(window);