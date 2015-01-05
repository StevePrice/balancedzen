
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

  Template.goals.events({
    'change [type=checkbox]': function(event) {
      console.log("Event change...");
      //event.stopPropagation();
      var checked = $(event.target).is(':checked');
      var oldRank = this.rank;
      Goals.update(this._id, {$set: {checked: checked, rank: oldRank}});
    },
    
    'focus input[type=text]': function(event) {
      console.log("Event focus input[type=text]...");
      Session.set(EDITING_KEY, this._id);
    },
    
    'blur input[type=text]': function(event) {
      console.log("Event blur input[type=text]...");
      if (Session.equals(EDITING_KEY, this._id))
        Session.set(EDITING_KEY, null);
    },
    
    'keydown input[type=text]': function(event) {
      console.log("Event keydown input...");
      // ESC or ENTER
      if (event.which === 27 || event.which === 13) {
        
            console.log("Event.which =  " + event.which);
            event.preventDefault();
            if ((event.which === 13) && (event.target.name === 'addFinGoal')) {
              var newgoal = $(event.target).find('addFinGoal');
              //console.log("new gaol= "+ event.target.value);
              Goals.insert({ title: event.target.value, checked: false, createdAt: new Date() });      
              event.target.value = '';
            }
    
        event.preventDefault();
        event.target.blur();
      }
    },
    
    // update the text of the item on keypress but throttle the event to ensure
    // we don't flood the server with updates (handles the event at most once 
    // every 300ms)
    'keyup input[type=text]': _.throttle(function(event) {
      console.log("Event keyup input...");
      Goals.update(this._id, {$set: {title: event.target.value}});
    }, 300),
    
    // handle mousedown otherwise the blur handler above will swallow the click
    // on iOS, we still require the click event so handle both
    'mousedown .js-delete-item, click .js-delete-item': function() {
      console.log("Event mousedown ...");
      Goals.remove(this._id);
      //if (! this.checked)
       //Lists.update(this.listId, {$inc: {incompleteCount: -1}});
    }
  });
  var EDITING_KEY = 'EDITING_TODO_ID';
  var currentIndex = 0;
  
  Template.goals.helpers({
    checkedClass: function() {
      return this.checked && 'checked';
    },
    editingClass: function() {
      return Session.equals(EDITING_KEY, this._id) && 'editing';
    },
    goals: function() {
      return Goals.find({}, {sort: {rank: 1}});
    },
    listIndex: function() {
      return currentIndex += 1;
    },
    goalsTotal: function() {
      return Goals.find({}).count();
    }
    //,
    //rank2: function (str) { 
    //  return this.str.toFixed(2); 
    //}
  });

  UI.registerHelper('indexedArray', function(context, options) {
    if (context) {
      return context.map(function(item, index) {
        item._index = index + 1;
        return item;
      });
    }
  });


  UI.registerHelper('goalsTotal', function(name) {
    return Goals.find({}).count();
  });

  UI.registerHelper('gttw', function(index) {
    return ( index > (Goals.find({}).count() * .2));
  });

  //Once the Template is rendered, run this function which
  //  sets up JQuery UI's sortable functionality
  Template.goals.rendered = function() {
    this.$('#goals').sortable({  // this needs to match the div element you want to drag
        stop: function(e, ui) {
          // get the dragged html element and the one before
          //   and after it
          el = ui.item.get(0)
          var before = ui.item.prev().get(0)
          var after = ui.item.next().get(0)
          console.log("Before from Blaze = " + Blaze.getData(before).rank);
          console.log("After  from Blaze = " + Blaze.getData(after).rank);
          var rankBefore = Blaze.getData(before).rank;
          var rankAfter  = Blaze.getData(after).rank
          if(typeof rankBefore === "undefined") {    
            console.log("Before === undefined.")
            newRank = Blaze.getData(after).rank - 1;
            console.log("B4undef newRank =" + newRank);
          } else if(typeof rankAfter === "undefined") {
            console.log("After  === undefined");
            newRank = Blaze.getData(before).rank + 1;
          }
          else {
            console.log("else clause")
            newRank = (rankAfter + rankBefore)/2;
          }
          console.log("newRank= " + newRank);
          //update the dragged Item's rank
          Goals.update({_id: Blaze.getData(el)._id}, {$set: {rank: newRank}});
        }
    })
  }

  
} /* If is client */