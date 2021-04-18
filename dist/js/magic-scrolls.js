"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _meteora = require("meteora");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*------------------------------------------------------------------
A class to control elements during a scroll event
------------------------------------------------------------------*/
var MagicScrolls = /*#__PURE__*/function () {
  function MagicScrolls() {
    var _this = this;

    var section = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, MagicScrolls);

    this.section = section || document.body;
    this.scroll = 0;
    this.offset = {};
    this.elements = [];
    this.enabled = false; // User settings defaults

    this.settings = {
      duration: 500,
      fps: 60
    }; // Assign the user options to the settings

    for (var key in this.settings) {
      if (options[key] != undefined) this.settings[key] = options[key];
    } // Used to throttle the functions and lock at a certain FPS


    this.time = {
      previous: null,
      current: null,
      elapsed: null,
      interval: this.settings.duration / this.settings.fps
    }; // On resize we need to change our offset

    (0, _meteora.attach)(window, 'resize', function () {
      return _this.update();
    }), 1000; // On scroll begin the tween

    (0, _meteora.attach)(window, 'scroll', function () {
      return _this.enable();
    }, 50);
  }

  _createClass(MagicScrolls, [{
    key: "push",
    value: function push(element) {
      var func = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      // Add a new element to the tween
      if (element && element.nodeType) this.elements.push(new ScrollElement(element, func)); // Enable tweening

      this.enable();
    }
  }, {
    key: "update",
    value: function update() {
      this.offset.top = (0, _meteora.offset)(this.section).y;
      this.offset.bottom = this.offset.top + this.section.clientHeight;
    }
  }, {
    key: "enable",
    value: function enable() {
      // Check we have any elements
      if (this.elements.length) {
        // Enable all the elements
        this.elements.forEach(function (element) {
          return element.enabled = true;
        }); // If the tween is disabled

        if (this.enabled == false) {
          // Enabled it
          this.enabled = true; // Call the function

          this.tween();
        }
      }
    }
  }, {
    key: "tween",
    value: function tween() {
      var _this2 = this;

      // Check if the tween should be enabled (should only function if there are any moving elements);
      this.enabled = this.elements.filter(function (el) {
        return el.enabled;
      }).length ? true : false; // If it is enabled

      if (this.enabled) {
        // Get the percentage we have scrolled through the container
        this.scroll = Math.min(100, Math.max(0, Math.round((window.pageYOffset + window.innerHeight - this.offset.top) / ((window.innerHeight + this.offset.bottom) / 100)))); // Some FPS maths

        this.time.current = Date.now();
        this.time.elapsed = this.time.current - this.time.previous; // If the time is right

        if (this.time.elapsed >= this.time.interval) {
          // More FPS maths
          this.time.previous = this.time.current - this.time.elapsed % this.time.interval; // Loop our elements

          this.elements.forEach(function (element) {
            // If the element enabled / still needs to move
            if (element.enabled) {
              // Move the element.percentage by a fraction based on our animation duration
              element.percentage -= Math.round((element.percentage - _this2.scroll) / _this2.time.interval * 100) / 100; // Call the element's function

              element.tween(); // element.node.style.transform = `translate3d(0, ${element.percentage * element.settings.scale}%, 0)`;
              // Check if the element has moved to the appropriate position

              if (Math.round(element.percentage) == _this2.scroll) element.enabled = false;
            }

            ;
          });
        } // Call the function again


        window.requestAnimationFrame(function () {
          return _this2.tween();
        });
      }
    }
  }]);

  return MagicScrolls;
}();

exports["default"] = MagicScrolls;

var ScrollElement = /*#__PURE__*/function () {
  function ScrollElement(element) {
    var func = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    _classCallCheck(this, ScrollElement);

    this.node = element;
    this.enabled = true;
    this.percentage = 0;
    this.func = func;
  }

  _createClass(ScrollElement, [{
    key: "tween",
    value: function tween() {
      // Call the function and pass in the element percentage
      if (this.func && _typeof(this.func)) this.func(this.percentage);
    }
  }]);

  return ScrollElement;
}();