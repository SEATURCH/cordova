var ko = require('knockout');
var Swipe = require('swipejs');

ko.bindingHandlers.swipableTabs = {
    init: function (element, valueAccessor, allBindingsAccessor, data, context) {
        window.mySwipe = new Swipe(element, {
          startSlide: 0,
          speed:150,
          // auto: 3000,
          draggable: true,
          autoRestart: false,
          continuous: false,
          // disableScroll: true,
          stopPropagation: true,
          callback: function(index, element) {},
          transitionEnd: function(index, element) {}
        });
    }
}