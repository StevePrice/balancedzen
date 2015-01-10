Meteor.startup(function () {
 //AND only seed if there are no items
    
	Goals = new Meteor.Collection('goals');
	if (Goals.find().count() === 0) {
	    Goals.insert( {"title": "Goals 1" , rank: 1 });
	    Goals.insert( {"title": "Goalsal 2" , rank: 2 });
	    Goals.insert( {"title": "Goal 3" , rank: 3 });
	};
	Items = new Meteor.Collection('items');
	if (Items.find().count() === 0) {
	    Items.insert( {"title": "Item 1" , rank: 1 });
	    Items.insert( {"title": "Item 2" , rank: 2 });
	    Items.insert( {"title": "Item 3" , rank: 3 });
	}
      
    // Site defailt user roles
    // banned == bad user
    // viewer == lookie lou not confirmed bu admin
    // memberL0 == free 0 group
    // memberL1 == free 1 group
    // memberL2 == free 2 groups
    // memberL3 == free 10+ groups
    // admin == admin
    // dev < admin
	var roles = ['banned', 'viewer', 'memberL0', 'memberL1', 'memberL2', 'memberL3', 'admin', 'dev']

	// this will fail if the roles package isn't installed
	if(Meteor.roles.find().count() === 0) {
	roles.map(function(role) {
	  Roles.createRole(role)
	})
	}
    
});