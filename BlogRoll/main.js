(function () {
	window.App = {
		Models: {},
		Views: {},
		Collections: {},
		Helpers: {}
	};
})();

// Backbone Model

App.Models.Blog = Backbone.Model.extend({
	defaults: {
		author: '',
		title: '',
		url: ''
	}
});

// Backbone Collection

App.Collections.Blogs = Backbone.Collection.extend({
	Model: Blog
});

var blogs = new App.Collections.Blogs([
	{
		author: 'John',
		title: ''
	},
]);