(function (){
	window.App = {
		Models: {},
		Views: {},
		Collections: {},
	
		Helper:{
			template: function (id){
				return _.template($('#' + id).html());
			}
		}
	};

	//single task model
	App.Models.Task = Backbone.Model.extend({});

	//single task view
	App.Views.Task = Backbone.View.extend({
		tagName: 'li',

		template: App.Helper.template('taskTemplate'),

		initialize: function (){
			//listen for model change
			this.model.on('change:title', this.render, this);
			this.model.on('destroy', this.remove, this);
		},

		//listen for DOM events
		'events': {
			'click .edit': 'editTag',
			'click .delete': 'destroy'
		},

		editTag: function (){
			var newTask = prompt('Change the previous task:', this.model.get('title'));

			//new task shouldn't be empty
			if(!$.trim(newTask))	return;

			this.model.set('title', newTask);
		},

		//note that destory and remove are separated
		destroy: function (){
			this.model.destroy();
		},

		remove: function (){
			this.$el.remove();
		},

		render: function (){
			var template = this.template(this.model.toJSON());
			this.$el.html(template);

			return this;
		}	
	});

	App.Collections.Tasks = Backbone.Collection.extend({
		model: App.Models.Task
	});

	App.Views.Tasks = Backbone.View.extend({
		tagName: 'ul',

		initialize: function () {
			this.collection.on('add', this.addOne, this);
		},

		render: function (){
			this.collection.each(this.addOne, this);

			return this;
		},

		addOne: function (task){
			//map through each of taskk in the collection
			var taskView = new App.Views.Task({ model: task });
			
			//append each to the root element('ul')
			this.$el.append(taskView.render().el);
		}
	});

	App.Views.addTask = Backbone.View.extend({
		el: '#addTask',

		'events': {
			'submit': 'submit'
		},

		submit: function (e) {
			e.preventDefault();
			// console.log('submitted');
			var newTaskTitle = $(e.currentTarget).find('input[type=text]').val();
			if(!$.trim(newTaskTitle))	return;
			$(e.currentTarget).find('input[type=text]').val('');

			var newTask = new App.Models.Task({ title: newTaskTitle });
			//add this model to the previous collection
			this.collection.add(newTask);
		}
	});

	var tasksCollection = new App.Collections.Tasks([
		{
			title: 'Go to work',
		},
		{
			title: 'Sleep',
		},
		{
			title: 'Gym',
		},
	]);

	var addTaskView = new App.Views.addTask({ collection: tasksCollection });

	var tasksView = new App.Views.Tasks({ collection: tasksCollection });

	$('.items').append(tasksView.render().el);

})();