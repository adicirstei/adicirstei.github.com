

(function(global){
  var blog = global.blog || {};
  
  $('a.navtoggle').on('click', function (event) {
    event.preventDefault();
    $('nav').toggleClass('expanded');
  });
  
})(window);
