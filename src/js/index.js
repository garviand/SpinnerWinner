var jss = require('jss').create();
var jssPreset = require('jss-preset-default');

function WinnerSpinner(opts) {

  this.selectedSegment = null;
  this.segments = opts.segments;
  this.pie = null;
  this.stylesheet = null;
  this.rotation = 0;
  this.isSpinning = false;

  jss.setup(jssPreset.default());

  var styles = {
    "container" : {
      "width": "200px"
    },
    "arrow" : {
      "margin": "0 auto",
      "width": "0", 
      "height": "0",
      "border-left": "10px solid transparent",
      "border-right": "10px solid transparent",
      "border-top": "20px solid #CCC"
    },
    "pie": {
      "border-radius": "100%",
      "height": '200px',
      "width": '200px',
      "overflow": "hidden",
      "position": "relative"
    },
    "spinning": {
      "animation-name": function(data) {
        return data.animation
      },
      "animation-duration": function(data) {
        return data.duration + "ms"
      },
      "transform": function(data) {
        return data.transform
      },
      "animation-iteration-count": "1",
      "animation-timing-function": "ease-in-out",
      "animation-fill-mode": "forwards"
    },
    "pie__segment": {
      "--a": "-100%",
      "--b": "100%",
      "--degrees": "calc((var(--offset, 0) / 100) * 360)",
      "clip-path": "polygon(var(--a) var(--a), var(--b) var(--a), var(--b) var(--b), var(--a) var(--b))",
      "height": "100%",
      "position": "absolute",
      "transform": "translate(0, -50%) rotate(90deg) rotate(calc(var(--degrees) * 1deg))",
      "transform-origin": "50% 100%",
      "width": "100%",
      "z-index": "calc(1 + var(--over50))",
      "&:after, &:before": {
        "background": "var(--bg)",
        "content": '""',
        "height": "100%",
        "position": "absolute",
        "width": "100%"
      },
      "&:after": {
        "opacity": "var(--over50, 0)"
      },
      "&:before": {
        "--degrees": "calc((var(--value, 45) / 100) * 360)",
        "transform": "translate(0, 100%) rotate(calc(var(--degrees) * 1deg))",
        "transform-origin": "50% 0%"
      }
    }
  }

  this.stylesheet = jss.createStyleSheet(styles, {link: true}).attach();

  var body = document.getElementsByTagName('body')[0];
  var container = document.createElement('div');
  container.classList.add(this.stylesheet.classes.container);
  body.appendChild(container);

  var arrow = document.createElement('div');
  arrow.classList.add(this.stylesheet.classes.arrow);
  container.appendChild(arrow);

  this.pie = document.createElement('div');
  this.pie.classList.add(this.stylesheet.classes.pie);
  container.appendChild(this.pie);

  for (var i = opts.segments.length - 1; i >= 0; i--) {
    var segment = opts.segments[i];
    var node = document.createElement('div');
    node.classList.add(this.stylesheet.classes['pie__segment']);
    node.style.cssText = '--offset: ' + (100 / opts.segments.length * i).toFixed(2) + '; --value: ' + (100 / opts.segments.length).toFixed(2) + '; --bg: ' + segment.color + ';'
    this.pie.appendChild(node);
  }

}

WinnerSpinner.prototype.spin = function() {

  if (this.isSpinning) {
    return
  }

  this.isSpinning = true;

  var rotation = Math.round(Math.random() * 4000 + (360 * 5)) + this.rotation;
  var duration = Math.round(Math.random() * 3000 + 2000);

  this.stylesheet.update('spinning', {
    "duration": duration,
    "animation": "spin"
  });

  this.stylesheet.deleteRule('@keyframes spin');

  this.stylesheet.addRule('@keyframes spin', {
    "from": {
      "transform": "rotate(" + this.rotation + "deg)"
    },
    "to": {
      "transform": "rotate(" + rotation + "deg)"
    }
  });

  this.rotation = rotation;

  this.pie.classList.add(this.stylesheet.classes.spinning);

  absRotation = rotation % 360;
  degreesPerSegment = 360 / opts.segments.length
  selectedSegmentIndex = Math.floor(absRotation / degreesPerSegment);
  selectedSegment = opts.segments[(opts.segments.length - 1) - selectedSegmentIndex]
  this.selectedSegment = selectedSegment;

  _this = this;
  setTimeout(function(){
    if (typeof selectedSegment.onSelected === "function") { 
      selectedSegment.onSelected(selectedSegment); 
    }
    else if (typeof opts.onFinish === "function") { 
      opts.onFinish(selectedSegment); 
    }
    _this.stylesheet.update('spinning', {
      "duration": duration,
      "animation": "",
      "transform": "rotate(" + rotation + "deg)"
    });
    _this.isSpinning = false;
  }, duration);
}

window.WinnerSpinner = WinnerSpinner;