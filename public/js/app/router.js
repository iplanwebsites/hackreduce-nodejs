var Router = Backbone.Router.extend({
    routes: {
        '/': 'homepage',

        '/help': 'help'
    },

    section: function (s) {
      $('section').addClass('hidden');
      $('section#' + s).removeClass('hidden');
      $(window).scrollTop( 0 );//no frills scroll-to top
        console.log('section: ' + s);
        if(s != 'share'){
          // close the popup share
        }
        //set active state on nav
        
        if($('.navbar li.'+s).length > 0){ 
          $('.navbar li').removeClass('active');
          $('.navbar li.'+s).addClass('active');
        }
        $('body').removeClass('dashboard promo location driver passenger location').addClass(s);
        
    },
    homepage: function (s) {
        //this.section('homepage');
    },

    prevent_default_href: function (css_selector) {
        $(css_selector).click(function (e) {
            //alert('click!');
            var h = $(this).attr('href');
            log('ROUTE: '+h);
            if ((h.indexOf('http://') != 0) && (!$(this).hasClass('norun')) && (h != "")) { // if it's not an external link...
                // TODO: if CTRL key was pressed, let default happen... (open in a new page...)
                e.preventDefault();
                app.router.navigate(h, true);
                //return false;
            }
        })
    }


});