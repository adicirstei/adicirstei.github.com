(function(global){
  'use strict';
  var blog = global.blog || {};
  
  var cat = global.document.querySelector('a.navtoggle');
  cat.addEventListener('click', function (ev) {
    ev.preventDefault();
    global.document.querySelector('nav').classList.toggle('expanded');
  });
})(window);
