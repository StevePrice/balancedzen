
if(Meteor.isServer) {
  //Only seed on the server
  Meteor.startup(function() {
    //AND only seed if there are no items
    if(Goals.find({}).count() != 0) 
      for(var i = 1; i <= 5; i++) 
        Goals.insert({ title: "Goal " + i, rank: i })

  })
}

if(Meteor.isClient) {
    
  Template.items.helpers({
    items: function() {
      return Items.find({}, {sort: {rank: 1}})
    }
  })

  //Once the Template is rendered, run this function which
  //  sets up JQuery UI's sortable functionality
  Template.items.rendered = function() {
    this.$('#items').sortable({
        stop: function(e, ui) {
          // get the dragged html element and the one before
          //   and after it
          el = ui.item.get(0)
          before = ui.item.prev().get(0)
          after = ui.item.next().get(0)

          if(!before) {
            newRank = Blaze.getData(after).rank - 1
          } else if(!after) {
            newRank = Blaze.getData(before).rank + 1
          }
          else
            newRank = (Blaze.getData(after).rank +
                       Blaze.getData(before).rank)/2
 
          //update the dragged Item's rank
          Items.update({_id: Blaze.getData(el)._id}, {$set: {rank: newRank}})
        }
    })
  }
  var saveList = function(list, template) {
    Session.set(EDITING_KEY, false);
    Goals.update(goal._id, {$set: {name: template.$('[name=name]').val()}});
  };

  var editList = function(list, template) {
    Session.set(EDITING_KEY, true);
    
    // force the template to redraw based on the reactive change
    Tracker.flush();
    template.$('.js-edit-form input[type=text]').focus();
  };


  Accounts.ui.config({
    // requestPermissions: {
    //   facebook: ['user_likes'],
    //   github: ['user', 'repo']
    // },
    // requestOfflineToken: {
    //   google: true
    // },
    passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
  });


  
} /* If is client */