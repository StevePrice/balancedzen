if (Meteor.isClient) {
  console.log("In Nav.js Client code");


  Template.navItems.helpers({
    activeIfTemplateIs: function (template) {
      var currentRoute = Router.current();
      //console.log ("currentRoute =  " + currentRoute.lookupTemplate());
      //console.log("Lalalal:=" + currentRoute.route.getName() );
      //console.log("template:=" + template );
      return currentRoute &&
        template === currentRoute.route.getName() ? 'active' : '';
    }
  });

} // is client

