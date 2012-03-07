  //Fullscreen API wrapper ( http://johndyer.name/native-fullscreen-javascript-api-plus-jquery-plugin/ )
  (function () {
    var a
      , b
      , c = {
        supportsFullScreen: !1,
        isFullScreen: function () {
          return !1;
        },
        requestFullScreen: function () {},
        cancelFullScreen: function () {},
        fullScreenEventName: "",
        prefix: ""
      }
    , d = "webkit moz o ms khtml".split(" ")

    if ("undefined" !== typeof document.cancelFullScreen) c.supportsFullScreen = !0; else for (a = 0, b = d.length; a < b; a++) if (c.prefix = d[a], "undefined" !== typeof document[c.prefix + "CancelFullScreen"]) {
      c.supportsFullScreen = !0;
      break;
    }
    c.supportsFullScreen && (c.fullScreenEventName = c.prefix + "fullscreenchange", c.isFullScreen = function () {
      switch (this.prefix) {
       case "":
        return document.fullScreen;
       case "webkit":
        return document.webkitIsFullScreen;
       default:
        return document[this.prefix + "FullScreen"];
      }
    }, c.requestFullScreen = function (a) {
      return "" === this.prefix ? a.requestFullScreen() : a[this.prefix + "RequestFullScreen"]();
    }, c.cancelFullScreen = function () {
      return "" === this.prefix ? document.cancelFullScreen() : document[this.prefix + "CancelFullScreen"]();
    }), "undefined" !== typeof jQuery && (jQuery.fn.requestFullScreen = function () {
      return this.each(function () {
        c.supportsFullScreen && c.requestFullScreen(this);
      });
    }), window.fullScreenApi = c;
  })();