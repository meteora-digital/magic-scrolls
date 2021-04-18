/*------------------------------------------------------------------
Import modules
------------------------------------------------------------------*/

import { attach, offset } from 'meteora';

/*------------------------------------------------------------------
A class to control elements during a scroll event
------------------------------------------------------------------*/

export default class MagicScrolls {
  constructor(section = false, options = {}) {
    this.section = section || document.body;
    this.scroll = 0;
    this.offset = {};
    this.elements = [];
    this.enabled = false;

    // User settings defaults
    this.settings = {
      duration: 500,
      fps: 60,
    }

    // Assign the user options to the settings
    for (let key in this.settings) {
      if (options[key] != undefined) this.settings[key] = options[key];
    }

    // Used to throttle the functions and lock at a certain FPS
    this.time = {
      previous: null,
      current: null,
      elapsed: null,
      interval: this.settings.duration / this.settings.fps,
    }

    // On resize we need to change our offset
    attach(window, 'resize', () => this.update()), 1000;
    // On scroll begin the tween
    attach(window, 'scroll', () => this.enable(), 50);
  }

  push(element, func = false) {
    // Add a new element to the tween
    if (element && element.nodeType) this.elements.push(new ScrollElement(element, func));
    // Enable tweening
    this.enable();
  }

  update() {
    this.offset.top = offset(this.section).y;
    this.offset.bottom = this.offset.top + this.section.clientHeight;
  }

  enable() {
    // Check we have any elements
    if (this.elements.length) {
      // Enable all the elements
      this.elements.forEach((element) => element.enabled = true);
      // If the tween is disabled
      if (this.enabled == false) {
        // Enabled it
        this.enabled = true;
        // Call the function
        this.tween();
      }
    }
  }

  tween() {
    // Check if the tween should be enabled (should only function if there are any moving elements);
    this.enabled = (this.elements.filter((el) => el.enabled).length) ? true : false;
    // If it is enabled
    if (this.enabled) {
      // Get the percentage we have scrolled through the container
      this.scroll = Math.min(100, Math.max(0, Math.round(((window.pageYOffset + window.innerHeight) - this.offset.top) / ((window.innerHeight + this.offset.bottom) / 100))));
      // Some FPS maths
      this.time.current = Date.now();
      this.time.elapsed = this.time.current - this.time.previous;
      // If the time is right
      if (this.time.elapsed >= this.time.interval) {
        // More FPS maths
        this.time.previous = this.time.current - (this.time.elapsed % this.time.interval);
        // Loop our elements
        this.elements.forEach((element) => {
          // If the element enabled / still needs to move
          if (element.enabled) {
            // Move the element.percentage by a fraction based on our animation duration
            element.percentage -= Math.round(((element.percentage - this.scroll) / (this.time.interval)) * 100) / 100;
            // Call the element's function
            element.tween();
            // element.node.style.transform = `translate3d(0, ${element.percentage * element.settings.scale}%, 0)`;
            // Check if the element has moved to the appropriate position
            if (Math.round(element.percentage) == this.scroll) element.enabled = false;
          };
        });
      }
      // Call the function again
      window.requestAnimationFrame(() => this.tween());
    }
  }
}

class ScrollElement {
  constructor(element, func = false) {
    this.node = element;
    this.enabled = true;
    this.percentage = 0;
    this.func = func;
  }

  tween() {
    // Call the function and pass in the element percentage
    if (this.func && typeof this.func) this.func(this.percentage);
  }
}