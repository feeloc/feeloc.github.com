window.addEvent('load',function(){
   $('navitems').getElements('li').addEvents({
       'mouseenter':function(){
           if(!this.hasClass('curr')){
               this.addClass('hover');
           }
       },'mouseleave':function(){
           this.removeClass('hover');
       }
   });
});