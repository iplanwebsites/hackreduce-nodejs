$(function(){
  // START!
  log('START');
  app = new Object();
  app.router = new Router();
  app.ui = new Ui();
  //
  
  app.cities = new Cities();
  app.cities.fetch({
    success: function(){
      console.log('cities received from server');
      app.ui.showCities();
      Backbone.history.start({pushState: false}); //show time!
      
      
      
    },
    error: function(){
      console.log('ERROR: no cities from server');
    }
  });
  

  
  // app.router.navigate('/', {trigger: true});
  log('navigated');
  //app.router.navigate("help", {trigger: true, replace: true});
  
});