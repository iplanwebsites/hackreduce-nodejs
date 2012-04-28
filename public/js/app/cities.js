




///////////////////////////////////////////////////////////////////
//   Model
////////////////////////////////////////////////////////////////

var City = Backbone.Model.extend({
 // url: "http://e-180.com/api/people/:id/",
 /* get_details: function() {
    var id = this.get('id');
    //var url = "http://e-180.com/api/user/"+id+"/?key=felix"
    this.fetch({success:model.show_details}); // work!
    //TODO
    // get:
    //this.set({color: cssColor});
  },*/
  show_details:function(){
    console.log('SHOW DETAILS');
    // set the section details using Jquery and all the properties...
  },
  fetch_details: function(){ //un-fuck the original fetch...
    
    
  },
 /* url: function(){
    return 'http://e-180.com/api/people/'+ this.get('id')+'/';
  },*/
  initialize: function() { 
    // Fetch user from server...
    // do local stuff, possibly validation, units, etc
    console.log('person created!' + this.get('name'));
   // _.debounce( app.ui.update_browse_sidebar(), 100);// TODO: Throttle this process using _
    }

});





///////////////////////////////////////////////////////////////////
//    Collection
////////////////////////////////////////////////////////////////


    Cities = Backbone.Collection.extend({
        model: City,
        // url: "/js/people.json",
         url: "/api/city/",
         url: "/toronto.json",
       // dataType: "jsonp",
       
        initialize: function() { 
          // Fetch user fromqw server...
          // do local stuff, possibly validation, units, etc
          console.log('city created!' + this.get('name'));
          
          this.set('loc', decodeGeoHash(this.get('geohash')));

          this.on("add", function(p) {
            console.log("Ahoy " + p.get("name") + " has been added!");
            //_.debounce( app.ui.update_browse_sidebar(), 100);
            
          });
          
          this.set_sort('alpha');
          //log(this);
          }, //eo init
          set_sort: function(sort){
            console.log('---------SET SORT: '+ sort);
           // this.sort = sort; //save it in the collection
            this.comparator = function(model){
              if(sort == 'nb_offers'){
                var nb_offers = model.get("offers").length;
                return nb_offers *-1;
              }else if(sort == 'oldest_members'){
                var num = model.get("id");
                return num ;
              }else if(sort == 'new_members'){
                var num = model.get("id");
                return num * -1;
              }else if(sort == 'least_offers'){
                var nb_offers = model.get("offers").length;
                return nb_offers;
              }else{
                  return model.get("name");
              }
              
              
            }
            this.sort(); //re-sort the collection with the new comparator fn
          }/*,
          comparator: function(model) {
            return model.get("name");
          }*/
          
        
        
    });
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
