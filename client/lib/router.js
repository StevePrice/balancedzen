//Items = new Mongo.Collection('items')
 
// iron router stuff
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

  this.route('manage');
  this.route('signout', {
    action: function() { App.signout(); }
  } );

});


/**/

if (Meteor.isClient) {
  Router.onBeforeAction('loading', {except: ['join', 'signin']});
  Router.onBeforeAction('dataNotFound', {except: ['join', 'signin']});
  
}

Router.onBeforeAction(function () {
  // all properties available in the route function
  // are also available here such as this.params

  if (!Meteor.user()) {
    // if the user is not logged in, render the Login template
    this.render('Login');
  } else {
    // otherwise don't hold up the rest of hooks or our route/action function
    // from running
    this.next();
  }
});
var IR_Filters = {
    // All standard subscriptions you need before anything works
    // the .wait() makes sure that it continues only if the subscription
    // is ready and the data available
    // Use: global
    baseSubscriptions: function() {
        this.subscribe('userData').wait();
    },
    // show login if a guest wants to access private areas
    // Use: {only: [privateAreas] }
    isLoggedIn: function(pause) {
        if (!(Meteor.loggingIn() || Meteor.user())) {
          Notify.setError(__('Please login.')); // some custom packages
          this.render('login');
          pause();
        }
    },
    // make sure to scroll to the top of the page on a new route
    // Use: global
    scrollUp: function() {
        $('body,html').scrollTop(0);
    },
    // if this route depends on data, show the NProgess loading indicator
    // http://ricostacruz.com/nprogress/
    // Use: global
    startNProgress: function() {
        if (_.isFunction(this.data)) {
          NProgress.start();
        }
    },
    // tell google analytics that a page was viewed
    // e.g. https://github.com/datariot/meteor-ganalytics
    // Use: global
    pageview: function() {
        GAnalytics.pageview(this.path);
    },
    // only show route if you are an admin
    // using https://github.com/alanning/meteor-roles
    // Use: {only: [adminAreas]}
    isAdmin: function(pause) {
        if (!Roles.userIsInRole(Meteor.userId(), ['admin'])) {
          this.render('login');
          pause();
        }
    },
    // animate old content out using
    // http://daneden.github.io/animate.css/
    // Use: global
    animateContentOut: function() {
        $('#content').removeClass("animated fadeIn fadeInRight");
        $('footer').addClass("hide");
    }
}
