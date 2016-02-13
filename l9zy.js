// l9zy - 92 #izi morray
// Just call l9zy.init();
// args ratioElementInViewPort (0 - 1)
//
// lazy script for async loading of images
// need requestAnimationFrame Polyfill for old browser support
//

var l9zy = (function() {

            "use strict";

            var scrollY,
                options = {
                    ratioElementInViewPort: 0
                },
                items = [],
                getViewportH = window.innerHeight,
                lazys = document.querySelectorAll('.lazy');

            var throttle = function(callback, limit) {
                var wait = false;
                return function() {
                    if (!wait) {
                        callback.call();
                        wait = true;
                        setTimeout(function() {
                            wait = false;
                        }, limit);
                    }
                };
            };

            var inViewport = function(el, h) {

                var elH = el.elH,
                    viewed = scrollY + getViewportH,
                    elTop = el.elTop,
                    _h = h || 0;

                return (elTop + (elH * _h)) <= viewed;

            };

            var loadCallback = function(el) {

                return function() {

                    el.appendChild(this);
                    requestAnimationFrame((function() {
                        el.classList.add('loaded');
                    }).bind(el));

                };

            };

            var render = function() {

                for (var i = 0; i < items.length; i++) {

                    var item = items[i];

                    //if element lazy don't contain loaded class do the lazy thing
                    if ((!item.el.classList.contains('loaded')) && (inViewport(item, options.ratioElementInViewPort)) && (!item.full)) {

                        var imgSrc = item.el.getAttribute('data-src');
                        var loader = document.createElement('span');
                        loader.classList.add('spinner');
                        item.el.appendChild(loader);

                        item.full = true;
                        var img = document.createElement('img');

                        img.onload = (loadCallback)(item.el);

                        img.src = imgSrc;

                    }

                }

            };

            var resizeHandler = function() {

                getViewportH = window.innerHeight;
                items.length = 0;

                for (var i = 0; i < lazys.length; i++) {

                    var el = lazys[i];
                    if (!el.classList.contains("loaded")) {
                            var elH = el.offsetHeight,
                                elTop = el.getBoundingClientRect().top;

                            items.push({
                                el: el,
                                elTop: elTop,
                                elH: elH
                            });
                        }
                    }

                };

                var scrollHandler = function() {

                    scrollY = window.pageYOffset;
                    requestAnimationFrame(function() {
                        render();
                    });

                };

                return {

                    elements: function(els) {
                        if (!els) {
                            lazys = document.querySelectorAll('.lazy');
                        } else {
                            lazys = els;
                        }
                        resizeHandler();
                        scrollHandler();
                    },

                    init: function(_options) {
                        options = _options || {};
                        window.addEventListener("resize", throttle(resizeHandler, 100));
                        window.addEventListener("scroll", throttle(scrollHandler, 100));
                        resizeHandler();
                        scrollHandler();

                    }

                };

            })();