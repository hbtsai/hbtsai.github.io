var scrollModule = (function() {
  'use strict';
  var dragThreshold = 80; // How far to drag to change pages
  var activePage = 0;
  var state = '';
  var touches = [];
  var firstTouch;
  var dragDistance = 0;
  var dragScrollPosition = 0;
  var scrollOffset = 0;
  var pages;
  var dividers;
  var scroller;
  var sidebar;
  var indicators;
  var scrollTimer;

  var init = function() {
    pages = document.getElementsByClassName('page');
    dividers = document.getElementsByClassName('divider');
    scroller = document.getElementById('scroll-container');
    sidebar = document.querySelector('body > .sidebar');
    indicators = document.querySelectorAll('body > .sidebar > .indicator-container');
  };

  // Scroll to reveal the dividers or move between pages
  // NB: to prevent native scrolling in iOS, the html and body tags must not be
  // scrollable. The scroller mimics scrolling by changing its top margin.
  var scrollTo = function(offset) {
    scroller.style.marginTop = -offset + 'px';
  };

  // Scroll event triggered by touchend
  // Should either go to an adjacent page or return back to current page
  var scrollToOffset = function(newPage) {
    scrollTo(scrollOffset);
    if (newPage) {
      document.body.scrollTop = 0;
      pages[activePage].scrollTop = 0;
    }
  };

  var pageCopy = function(index) {
    if (index === 0) {
      return "Pull harder to load next"
    } else if (index === 1) {
      return "Finish Panel Configuration"
    } else if (index === 2) {
      return "Finish Location Selection"
    }
    return "Next"
  };

  // Change copy and visibility of arrows in dividers on page change
  var updateDivider = function(index, top) {
    if (dividers[index]) {
      var topDividerChildren = dividers[index].children;
      topDividerChildren[0].style.display = top ? 'inline' : 'none';
      topDividerChildren[1].innerHTML = top ? 'Pull harder to go back' : pageCopy(index);
      topDividerChildren[2].style.display = top ? 'none' : 'inline';
    }
  };

  var updateDividers = function() {
    updateDivider(activePage - 1, true);
    updateDivider(activePage, false);
  };

  // Show or hide sidebar, or update active and visited sidebar indicators
  var updateSidebar = function(newPageIndex) {
    if (newPageIndex === 0) {
      sidebar.style.display = "none";
    } else {
      sidebar.style.display = "flex";
      indicators.forEach(function(indicator, index) {
        if (index < newPageIndex - 1) {
          indicator.classList.remove('active');
          indicator.classList.add('visited');
        } else if (index === newPageIndex - 1) {
          indicator.classList.add('visited', 'active');
        } else {
          indicator.classList.remove('active');
          indicator.classList.remove('visited');
        }
      });
    }
  };

  var pageDown = function() {
    scrollOffset += pages[activePage].offsetHeight;
    scrollOffset += dividers[activePage].offsetHeight;
    activePage += 1;
    updateDividers();
    scrollToOffset(true);
    updateSidebar(activePage);
  };

  var pageUp = function() {
    scrollOffset -= pages[activePage - 1].offsetHeight;
    scrollOffset -= dividers[activePage - 1].offsetHeight;
    activePage -= 1;
    updateDividers();
    scrollToOffset(true);
    updateSidebar(activePage);
  };

  // Track regular scroll events to prevent page scrolling
  var scroll = function(event) {
    state = 'scrolling';
    if (scrollTimer) {
      clearTimeout(scrollTimer);
    }
    scrollTimer = setTimeout(function() { state = ''; }, 30);
  };

  var getTouches = function (event) {
    var e = event.originalEvent || event;
    return e.touches || [e];
  };

  // Start a series of touch events, track initial touch
  var touchStart = function(event) {
    // Remove nontouch class if user causes a touch event
    if (!firstTouch) {
      document.body.classList.remove('nontouch');
    }
    touches = getTouches(event);
    firstTouch = touches[0];
  };

  var touchMove = function(event) {
    if (state !== 'scrolling') {
      var atTop = pages[activePage].scrollTop === 0;
      var atBottom = pages[activePage].offsetHeight + pages[activePage].scrollTop === pages[activePage].scrollHeight;
      touches = getTouches(event);
      dragDistance = firstTouch.pageY - touches[0].pageY;
      if (atTop && dragDistance < 0 || atBottom && dragDistance > 0) {
        // Reveal divider if moving up from top of page or down from bottom
        state = 'dragging';
        var dragSum = dragScrollPosition + dragDistance;
        dragScrollPosition = Math.sign(dragSum) * Math.min(Math.abs(dragSum), dividers[0].offsetHeight);
        scrollTo(scrollOffset + dragScrollPosition);
        return;
      }
    }
    scrollToOffset(false);
  };

  var touchEnd = function(event) {
    if (state === 'dragging') {
      if (dragDistance > dragThreshold && pages.length - activePage > 1) {
        // Go to next page
        pageDown();
      } else if (dragDistance < -dragThreshold && pages.length - activePage < pages.length) {
        // Go to previous page
        pageUp();
      } else {
        // Stay on current page
        scrollToOffset();
      }
    }
    // Reset state and drag distance
    dragDistance = 0;
    dragScrollPosition = 0;
    state = '';
  };

  var indicatorScroll = function(index) {
    scrollOffset =  pages[index].offsetTop - pages[0].offsetTop;
    updateSidebar(index);
    scrollToOffset(true);
    activePage = index;
  };

  return {
    init: init,
    scroll: scroll,
    indicatorScroll: indicatorScroll,
    touchStart: touchStart,
    touchMove: touchMove,
    touchEnd: touchEnd,
  };
}) ();

var initScroll = function() {
  'use strict';
  scrollModule.init();
  // Add event listeners to every page
  [].forEach.call(document.getElementsByClassName('page'), function(element) {
    element.addEventListener('scroll', scrollModule.scroll);
    element.addEventListener('touchstart', scrollModule.touchStart, {passive: true});
    element.addEventListener('touchmove', scrollModule.touchMove, {passive: true});
    element.addEventListener('touchend', scrollModule.touchEnd);
    element.addEventListener('touchcancel', scrollModule.touchEnd);
    element.addEventListener('touchleave', scrollModule.touchEnd);
  });
};

if (document.readyState !== "loading") {
  initScroll();
} else {
  document.addEventListener("DOMContentLoaded", initScroll);
}
