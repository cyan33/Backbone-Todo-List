(function () {
	window.App = {
		Models: {},
		Views: {},
		Collections: {},
		Helpers: {
			template: function (id) {
				return _.template($('#' + id).html());
			}
		}
	};
})();

App.Models.Task = Backbone.Model.extend({
	defaults: {
		title: ''
	}
});

// the model of adding a task
App.Models.addTask = Backbone.Model.extend({ });

// the view of adding a task
App.Views.addTask = Backbone.View.extend({
	el: '#addTask',

	'events': {
		'submit': 'submit'
	},

	submit: function (e) {
		e.preventDefault();

		// console.log('submitted.');
		var newTaskTitle = $('input[type=text]').val();

		if (!$.trim(newTaskTitle))	return;

		var newTask = new App.Models.Task({ title: newTaskTitle });
		this.collection.add(newTask);
		// console.log(newTaskTitle + ' added to the collection');
	}
});

App.Views.Task = Backbone.View.extend({
	tagName: 'li',

	initialize: function () {
		this.model.on('destroy', this.remove, this);
		this.model.on('change:title', this.render, this);
	},

	'events': {
		'click .delete': 'destroy',
		'click .edit': 'edit'
	},

	edit: function () {
		var newTaskTitle = prompt('Please Edit the title of your task:', this.model.get('title'));

		this.model.set('title', newTaskTitle);
	},

	destroy: function () {
		this.model.destroy();
	},

	template: App.Helpers.template('taskTemplate'),

	render: function () {
		this.$el.html(this.template(this.model.toJSON()));

		return this;
	}
});

App.Collections.Tasks = Backbone.Collection.extend({
	model: App.Models.Task
});


//	Collection View
App.Views.Tasks = Backbone.View.extend({
	tagName: 'ul',

	initialize: function () {
		this.collection.on('add', this.addOne, this);
	},

	render: function () {
		this.collection.each(this.addOne, this);

		return this;
	},

	addOne: function (task) {
		var taskView = new App.Views.Task({ model: task });

		this.$el.append(taskView.render().el);
	}
});

// Original Collection
var tasksCollection = new App.Collections.Tasks([
	{
		title: 'Go for subtle'
	},
	{
		title: 'Go to the store'
	},
	{
		title: 'Buy books'
	}
]);

var tasksView = new App.Views.Tasks({ collection: tasksCollection });

var addTaskView =  new App.Views.addTask({ collection: tasksCollection });

$(document.body).append(tasksView.render().el);
