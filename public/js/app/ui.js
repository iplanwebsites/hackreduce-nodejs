var Ui = Backbone.View.extend({

  el: $("body"),
  initialize: function() { 
   // $('#email_invite').submit(this.send_email_invites); //bind extra events
    $('#search-form').submit(this.submit_search); //bind extra events
    $('#search-form .s').keyup(this.submit_search);
    $('.popo').popover();
    
  },
  events: {
    "click button.btn.no-debug":                       "click_stuff",
    "change #range":                       "range"
    
    //"click .button.edit":   "openEditDialog",
   // "click .button.delete": "destroy"
  },
 click_stuff:  function(ev) {
  // var e = ev['currentTarget'];
  // var sort = $(e).attr('data-sort');
   console.log( sort );
   app.people.set_sort(sort);
   this.update_browse_sidebar();// update the HTML now...
   return false;
  },
  range:  function(ev) {
     var e = ev['currentTarget'];
     var val = new Number($(e).val());
     //console.log( val );
     var h = (val + 5) % 24;
     $('.navbar .range strong').html(h +':00');
     this.showCities();// update the HTML now...
     return false;
    },
  showCities:  function(ev) {
    // var e = ev['currentTarget'];
    // var sort = $(e).attr('data-sort');
     $('#cache').hide();
     var peeps = app.cities.models;


     var templ = $("#city_template").html(); 
     console.log(templ);
     var html ="";
     console.log(peeps);
     p = peeps;
     console.log(peeps.length);
     _.each(peeps, function(item){ 
         html += _.template( templ , item.attributes );
      });
      
      
      grid = {
        loc: [44.1, 22.2],
        geohash: 's92nco',
        city: 'toronto', //unique id
        precision:10,
        freq:{
          weekdays:{
            total: 312,
            by_hour: [0,0,0,0,0,3,5,2,4,6,6,4,5,6,4,56,4,56,42]
          },
          saturday:{
            total: 222,
            by_hour: [0,0,0,0,0,3,5,2,4,6,6,4,5,6,4,56,4,56,42]
          },
          sunday:{
            total: 189,
            by_hour: [0,0,0,0,0,3,5,2,4,6,6,4,5,6,4,56,4,56,42]
          }
        }
      }
      city = {
        name: 'Montreal',
        id: 'stm',
        population: 3473000,
        grid: [grid, grid, grid, grid] //poll from the collection
      }
      html += _.template( templ , city );
      
     $('#cities').html(html);//override div content...
     
    },

    update_browse_sidebar: function(){
      
      //console.log(peeps);
    }
  

});

