//Items = new Mongo.Collection('items')
 
// // iron router stuff
// Router.route('/', function () {
//   this.render('Home');
// }); 


//server check only required because this code
// is running on both client AND server
if(Meteor.isServer) {
  //Only seed on the server
  Meteor.startup(function() {
    //AND only seed if there are no items
    if(Goals.find({}).count() != 0) {
      for(var i = 1; i <= 5; i++) {
        Goals.insert({
            title: "Goal " + i,
            rank: i
        })
      }
    }
  })
}
//Only required because this code is running on
//  the client AND server
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

  Template.goals.helpers({
    goals: function() {
      return Goals.find({}, {sort: {rank: 1}})
    }
  })

  //Once the Template is rendered, run this function which
  //  sets up JQuery UI's sortable functionality
  Template.goals.rendered = function() {
    this.$('#goals').sortable({  // this needs to match the div element you want to drag
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
          Goals.update({_id: Blaze.getData(el)._id}, {$set: {rank: newRank}})
        }
    })
  }

  
} /* If is client */