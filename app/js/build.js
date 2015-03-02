"use strict";

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
{
  var factory = PanelFactory({ items: [] });
  var panel = React.render(factory, document.getElementById("panel"));
  panel.setState({
    itemsStatus: []
  });
}
{
  var factory = PropertiesFactory();
  var properties = React.render(factory, document.getElementById("properties"));
}
var audioContext = new (window.AudioContext || window.webkitAudioContext)();
var analyser = audioContext.createAnalyser();

$("#add-oscillator").click(function (e) {
  var oscillator = audioContext.createOscillator(),
      gain = audioContext.createGain();

  var types = ["sine", "square", "sawtooth", "triangle"];

  var newLine = {
    name: "Oscillator " + (panel.props.items.length + 1),
    oscillator: oscillator,
    gain: gain,
    connected: false,
    properties: Object.defineProperties({
      types: {
        frequency: {
          type: "number" },
        detune: {
          type: "number" },
        type: {
          type: "select",
          options: types
        },
        volume: {
          type: "number"
        }
      }
    }, {
      frequency: {
        set: function (value) {
          if (typeof value !== "number") return;

          oscillator.frequency.value = value;
        },
        get: function () {
          return oscillator.frequency.value;
        },
        enumerable: true,
        configurable: true
      },
      detune: {
        set: function (value) {
          if (typeof value !== "number") return;

          oscillator.detune.value = value;
        },
        get: function () {
          return oscillator.detune.value;
        },
        enumerable: true,
        configurable: true
      },
      type: {
        set: function (value) {
          if (!types.includes(value)) return;

          oscillator.type = value;
        },
        get: function () {
          return oscillator.type;
        },
        enumerable: true,
        configurable: true
      },
      volume: {
        set: function (value) {
          if (typeof value !== "number") return;

          gain.gain.value = value / 100;
        },
        get: function () {
          return parseInt(Math.round(gain.gain.value * 100));
        },
        enumerable: true,
        configurable: true
      }
    }) };

  oscillator.start();
  oscillator.connect(gain);

  panel.setState({
    itemsStatus: panel.state.itemsStatus.concat(false)
  });
  panel.setProps({
    items: panel.props.items.concat(newLine)
  });
});

$("#add-stream").click(function (e) {
  navigator.getUserMedia({ audio: true }, function (stream) {
    var stream = audioContext.createMediaStreamSource(stream),
        gain = audioContext.createGain();

    var newLine = {
      name: "Line In " + (panel.props.items.length + 1),
      oscillator: stream,
      gain: gain,
      connected: false,
      properties: Object.defineProperties({
        types: {
          volume: {
            type: "number"
          }
        }
      }, {
        volume: {
          set: function (value) {
            if (typeof value !== "number") return;

            gain.gain.value = value / 100;
          },
          get: function () {
            return parseInt(Math.round(gain.gain.value * 100));
          },
          enumerable: true,
          configurable: true
        }
      })
    };

    stream.connect(gain);

    panel.setState({
      itemsStatus: panel.state.itemsStatus.concat(false)
    });
    panel.setProps({
      items: panel.props.items.concat(newLine)
    });
  }, function (e) {});
});
var $canvas = $("#wave-canvas"),
    $wave = $("#wave");

var canvas = $canvas.get(0).getContext("2d");

var stop = false;

function drawWave() {
  var bufferLength = analyser.fftSize;
  var data = new Float32Array(bufferLength);

  var WIDTH = undefined,
      HEIGHT = undefined,
      SIDE_MARGIN = undefined,
      width = undefined,
      canvasWidth = undefined,
      canvasHeight = undefined;

  function setSizes() {
    WIDTH = $canvas.width() * 0.8;
    HEIGHT = $canvas.height() * 0.6;

    SIDE_MARGIN = $canvas.width() * 0.2;
    width = WIDTH * (1 / bufferLength);

    canvasWidth = $canvas.width();
    canvasHeight = $canvas.height();
  }

  setSizes();
  $(window).resize(setSizes);

  (function loop() {
    if (stop) {
      return;
    }requestAnimationFrame(function () {
      analyser.getFloatTimeDomainData(data);

      canvas.clearRect(0, 0, canvasWidth, canvasHeight);
      canvas.strokeStyle = "#D51A00";
      canvas.fillStyle = "#D51A00";
      canvas.beginPath();

      var x = SIDE_MARGIN / 2;

      for (var i = 0; i < bufferLength; i++) {
        var value = data[i] * HEIGHT / 2;

        // canvas.fillStyle = 'rgb('+(value);
        canvas.rect(x, HEIGHT - value / 2, width, value);

        x += width;
      }

      canvas.fill();

      loop();
    });
  })();
}

var map = function (a, oldMin, oldMax, min, max) {
  return (a - oldMin) / (oldMax - oldMin) * (max - min) + min;
};

$canvas.attr("width", $wave.width());
$canvas.attr("height", $wave.height());
$(window).resize(function () {
  $canvas.attr("width", $wave.width());
  $canvas.attr("height", $wave.height());
});

drawWave();
//# sourceMappingURL=build.js.map