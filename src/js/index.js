var jss = require('jss').create();
var jssNested = require('jss-plugin-nested');

function WinnerSpinner(opts) {

  function generateRotation() {
    return Math.round(Math.random() * 4000 + (360 * 5));
  }

  function generateDuration() {
    return Math.round(Math.random() * 3000 + 2000);
  }

  jss.use(jssNested.default());

  var rotation = generateRotation();
  var duration = generateDuration();

  var styles = {
    "pie": {
      "border-radius": "100%",
      "height": '200px',
      "width": '200px',
      "overflow": "hidden",
      "position": "relative"
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
    },
    "spinning": {
      "animation-name": "spin",
      "animation-duration": duration + "ms",
      "animation-iteration-count": "1",
      "animation-timing-function": "ease-in-out",
      "animation-fill-mode": "forwards"
    },
    "@keyframes spin": {
      "from": {
        "transform": "rotate(0deg)"
      },
      "to": {
        "transform": "rotate(" + rotation +  "deg)"
      }
    }
  }

  var stylesheet = jss.createStyleSheet(styles).attach()

  var pie = document.createElement('div');
  pie.classList.add(stylesheet.classes.pie);
  body = document.getElementsByTagName('body')[0];
  body.appendChild(pie);

  for (var i = opts.segments.length - 1; i >= 0; i--) {
    var segment = opts.segments[i];
    var node = document.createElement('div');
    node.classList.add('pie__segment-0-1-2');
    node.style.cssText = '--offset: ' + (100 / opts.segments.length * i).toFixed(2) + '; --value: ' + (100 / opts.segments.length).toFixed(2) + '; --bg: ' + segment.color + ';'
    pie.appendChild(node);
  }

  pie.classList.add(stylesheet.classes.spinning);

  absRotation = rotation % 360;
  degreesPerSegment = 360 / opts.segments.length
  selectedSegmentIndex = Math.floor(absRotation / degreesPerSegment);

  setTimeout(function(){
    var selectedSegment = opts.segments[(opts.segments.length - 1) - selectedSegmentIndex]
    if (typeof selectedSegment.onSelected === "function") { 
      selectedSegment.onSelected(selectedSegment); 
    }
    else if (typeof opts.onFinish === "function") { 
      opts.onFinish(selectedSegment); 
    }
  }, duration);
}

window.WinnerSpinner = WinnerSpinner;