Meteor.startup(function () {
 //AND only seed if there are no items
    
    Goals = new Meteor.Collection('goals');
    if (Goals.find().count() === 0) {
	    Goals.insert( {"title": "Item 1" , rank: 1 });
	    Goals.insert( {"title": "Item 2" , rank: 2 });
	    Goals.insert( {"title": "Item 3" , rank: 3 });
    }
      
    
    
});