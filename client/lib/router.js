Router.configure({
  // we use the  appBody template to define the layout for the entire app
  layoutTemplate: 'layout',

  // the appNotFound template is used for unknown routes and missing lists
  notFoundTemplate: 'appNotFound',

  // show the appLoading template whilst the subscriptions below load their data
  loadingTemplate: 'appLoading',

  // wait on the following subscriptions before rendering the page to ensure
  // the data it's expecting is present
  waitOn: function() {
    return [
      Meteor.subscribe('Goals'),
      Meteor.subscribe('Items')
    ];
  }
});
Router.route('/', function () {
  this.render('Home');
}); 

Router.map(function() {
  
  this.route('goals', {
    /* path: '/', 
    action: function() {
      this.render();
    },*/ 
    data: function () {
      GoalsData = { goals: Goals.find({}, { sort: {rank: 1}}) };
      return GoalsData;
    }
  });
  this.route('home', {
    /* path: '/', */
    action: function() { this.render(); },
    data: function () { 
      ItemsData = {items: Items.find({})};
      return ItemsData; }
  } );

  this.route('plans');

  this.route('actions');
});


/**/

if (Meteor.isClient) {
  Router.onBeforeAction('loading', {except: ['join', 'signin']});
  Router.onBeforeAction('dataNotFound', {except: ['join', 'signin']});
  
}