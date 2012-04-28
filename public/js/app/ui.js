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


     templ = $("#city_template").html(); 
     console.log(templ);
     var html ="";
     console.log(peeps);
     p = peeps;
     console.log(peeps.length);
     _.each(peeps, function(item){ 
         html += _.template( templ , item.attributes );
      });
      console.log(peeps.length);
      
     var grid = {
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
     var city = {
        name: 'Montreal',
        id: 'stm',
        pie_url: 'https://chart.googleapis.com/chart?cht=p&chd=s:Uf9a&chs=200x100'+'&chco=ffff00,FF0000'+'&chdl=Great|Ok|Average|Poor',
        population: 3473000,
        grid: [grid, grid, grid, grid] //poll from the collection
      }
      
      console.log(peeps.length);
      templ2 = $("#city_template").html(); 
      console.log(templ2);
      console.log(city)
       html += _.template( templ , city );
      html += _.template( templ , city );
      html += _.template( templ , city );
      html += _.template( templ , city );
      
      
      
   $('#cities').html(html);//override div content...
      
      console.log(peeps.length +'cc');
      _.each($('#cities .city'), function(item){ 
        //app.ui.draw_chart(item)
           
      });
        
     
     
    },

    update_browse_sidebar: function(){
      
      //console.log(peeps);
    },
    draw_chart: function(el){
      console.log('pie')
            // Create the data table.
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Topping');
            data.addColumn('number', 'Slices');
            data.addRows([
              ['Mushrooms', 3],
              ['Onions', 1],
              ['Olives', 1],
              ['Zucchini', 1],
              ['Pepperoni', 2]
            ]);

            // Set chart options
            var options = {'title':'How Much Pizza I Ate Last Night',
                           'width':400,
                           'height':300};

            // Instantiate and draw our chart, passing in some options.
            var chart = new google.visualization.PieChart( $(el).children('pie')[0] );
            chart.draw(data, options);
          }
  

});

