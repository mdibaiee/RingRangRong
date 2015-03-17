"use strict";

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

(function (global) {
  var map = function (a, oldMin, oldMax, min, max) {
    return (a - oldMin) / (oldMax - oldMin) * (max - min) + min;
  };

  var $tooltip = $("#tooltip");

  $.fn.tooltip = function (text, coords) {
    if (text === false) {
      $tooltip.addClass("hide");
      return;
    }
    $tooltip.removeClass("hide");
    $tooltip.text(text);

    $tooltip.css({
      left: coords.x,
      top: coords.y
    });
  };

  global.map = map;
  global.tooltip = tooltip;
})(window);

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
(function (global) {
  function initTimelapses() {
    var $panel = $("#panel");
    var $timelapses = $("[id^=\"i-\"]");

    var width = $panel.width() * 0.8;
    var height = 30;
    var distance = width / 100;

    $timelapses.each(function (e) {
      this.width = width;
      this.height = height;

      var id = this.id.slice(2);
      var item = panel.props.items[+id];

      var c = this.getContext("2d");
      c.clearRect(0, 0, width, height);
      c.fillStyle = "white";

      c.beginPath();
      for (var i = 0; i < 100; i++) {
        var h = i % 10 === 0 ? 20 : 10;
        c.rect(i * distance, height - h, 2, h);
      }

      c.fill();
      c.closePath();

      c.fillStyle = "rgba(255, 110, 110, 0.6)";

      for (var i = 0, len = item.range.length; i < len; i++) {
        var _item$range$slice = item.range.slice(i, i + 2);

        var _item$range$slice2 = _slicedToArray(_item$range$slice, 2);

        var start = _item$range$slice2[0];
        var end = _item$range$slice2[1];

        if (typeof end === "undefined" || typeof start === "undefined") continue;
        start *= width;
        end *= width;

        c.beginPath();
        c.rect(start, 0, end - start, 30);
        c.stroke();
        c.fill();
        c.closePath();
      }
    });
  }

  $(".tools .fa-scissors").click(function () {
    var $timelapses = $("[id^=\"i-\"]");

    $timelapses.removeClass().addClass("cut");
  });

  $(".tools .fa-plus").click(function () {
    var $timelapses = $("[id^=\"i-\"]");

    $timelapses.removeClass().addClass("add");
  });

  $(".tools .fa-compress").click(function () {
    var $timelapses = $("[id^=\"i-\"]");

    $timelapses.removeClass().addClass("merge");
  });

  $(".tools .fa-trash-o").click(function () {
    var $timelapses = $("[id^=\"i-\"]");

    $timelapses.removeClass().addClass("delete");
  });

  global.initTimelapses = initTimelapses;
})(window);

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

(function (e, t) {
  $(document).ready(function () {
    $(document.body).click(function (e) {
      var $target = $(e.target);
      if ($target.is("[data-modal]") || $target.parents("[data-modal]").length || $target.is(".modal") || $target.parents(".modal").length) return;
      $(".modal").addClass("hide");
    });
  });
})(undefined);
(function (global) {
  var audioContext = new (window.AudioContext || window.webkitAudioContext)();
  var analyser = audioContext.createAnalyser();

  var $selectBeep = $("#select-beep"),
      $addBeep = $("#add-beep");

  $addBeep.click(function (e) {
    $selectBeep.removeClass("hide");
  });

  $selectBeep.on("click", "span", function (e) {
    var id = parseInt(e.target.textContent.trim(), 10) - 1;

    var $audio = $("#audio-" + id);
    if (!$audio.length) {
      (function () {
        var url = location.pathname + "/beeps/" + id + ".mp3";
        $audio = $("<audio src=\"" + url + "\"></audio>");
        var audio = $audio.get(0);
        audio.id = "audio" + id;
        audio.src = url;
        audio.loop = true;
        $audio.on("canplay", function (e) {
          audio.play();
        });

        $(document.body).append($audio);
      })();
    }

    var beep = audioContext.createMediaElementSource($audio.get(0)),
        gain = audioContext.createGain();

    var newLine = {
      name: "[" + (id + 1) + "] Beep " + (panel.props.items.length + 1),
      oscillator: beep,
      gain: gain,
      connected: true,
      range: [0, 1],
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
          configurable: true,
          enumerable: true
        }
      })
    };

    beep.connect(gain);

    panel.setState({
      itemsStatus: panel.state.itemsStatus.concat(true)
    });
    panel.setProps({
      items: panel.props.items.concat(newLine)
    });

    $selectBeep.addClass("hide");
  });

  $("#add-oscillator").click(function (e) {
    var oscillator = audioContext.createOscillator(),
        gain = audioContext.createGain();

    var types = ["sine", "square", "sawtooth", "triangle"];

    var newLine = {
      name: "Oscillator " + (panel.props.items.length + 1),
      oscillator: oscillator,
      gain: gain,
      connected: true,
      range: [0, 1],
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
          configurable: true,
          enumerable: true
        },
        detune: {
          set: function (value) {
            if (typeof value !== "number") return;

            oscillator.detune.value = value;
          },
          get: function () {
            return oscillator.detune.value;
          },
          configurable: true,
          enumerable: true
        },
        type: {
          set: function (value) {
            if (types.indexOf(value) === -1) return;

            oscillator.type = value;
          },
          get: function () {
            return oscillator.type;
          },
          configurable: true,
          enumerable: true
        },
        volume: {
          set: function (value) {
            if (typeof value !== "number") return;

            gain.gain.value = value / 100;
          },
          get: function () {
            return parseInt(Math.round(gain.gain.value * 100));
          },
          configurable: true,
          enumerable: true
        }
      }) };

    oscillator.start();
    oscillator.connect(gain);

    panel.setState({
      itemsStatus: panel.state.itemsStatus.concat(true)
    });
    panel.setProps({
      items: panel.props.items.concat(newLine)
    });
  });

  $("#add-stream").click(function (e) {
    navigator.getUserMedia({ audio: true }, function (media) {
      var stream = audioContext.createMediaStreamSource(media),
          gain = audioContext.createGain();

      stream.connect(audioContext.destination);

      var record = new Recorder(stream, {
        workerPath: "/app/js/libs/recorderWorker.js"
      });

      record.record();

      setTimeout(function () {
        record.stop();

        record.getBuffer(function (buffers) {
          var buff = audioContext.createBuffer(2, buffers[0].length, audioContext.sampleRate);
          var bufferSource = audioContext.createBufferSource();

          buff.getChannelData(0).set(buffers[0]);
          buff.getChannelData(1).set(buffers[1]);

          bufferSource.buffer = buff;
          bufferSource.connect(gain);

          bufferSource.loop = true;

          bufferSource.start();

          var newLine = {
            name: "Line In " + (panel.props.items.length + 1),
            oscillator: bufferSource,
            gain: gain,
            connected: true,
            range: [0, 1],
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
                configurable: true,
                enumerable: true
              }
            })
          };

          panel.setState({
            itemsStatus: panel.state.itemsStatus.concat(true)
          });
          panel.setProps({
            items: panel.props.items.concat(newLine)
          });
        });
      }, 10000);
    }, function (e) {});
  });

  global.audioContext = audioContext;
  global.analyser = analyser;
})(window);

(function (global) {
  var $canvas = $("#wave-canvas"),
      $wave = $("#wave");

  var canvas = $canvas.get(0).getContext("2d");

  var stop = false;

  function stopWave() {
    stop = true;
  }

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
        stop = false;
        return;
      }
      requestAnimationFrame(function () {
        analyser.getFloatTimeDomainData(data);

        canvas.clearRect(0, 0, canvasWidth, canvasHeight);
        canvas.strokeStyle = "#D51A00";
        canvas.fillStyle = "#D51A00";
        canvas.beginPath();

        var x = SIDE_MARGIN / 2;

        for (var i = 0; i < bufferLength; i++) {
          var value = data[i] * HEIGHT / 2;

          canvas.rect(x, HEIGHT * 0.7 - value / 2, width, value);

          x += width;
        }

        canvas.fill();

        loop();
      });
    })();
  }

  $canvas.attr("width", $wave.width());
  $canvas.attr("height", $wave.height());
  $(window).resize(function () {
    $canvas.attr("width", $wave.width());
    $canvas.attr("height", $wave.height());
  });

  global.drawWave = drawWave;
  global.stopWave = stopWave;
})(window);

(function (global) {
  var timeouts = [];

  var status = 0;

  var DURATION = 10 * 1000;

  function play() {
    var items = panel.props.items;

    var hasOn = items.some(function (a) {
      return a.connected;
    });

    if (status === 1 || !items.length || !hasOn) {
      return;
    }timeouts = [];
    status = 1;

    analyser.connect(audioContext.destination);
    drawWave();

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _ret = (function () {
          var item = _step.value;

          if (!item.connected) return "continue";
          var range = item.range;

          for (var i = 0, len = range.length; i < len; i += 2) {
            if (typeof range[i] === "undefined") {
              i--;
              continue;
            }

            var pair = range.slice(i, i + 2);
            timeouts.push(setTimeout(function () {
              item.gain.connect(analyser);
            }, pair[0] * DURATION), setTimeout(function () {
              item.gain.disconnect(analyser);
            }, pair[1] * DURATION));
          }
        })();

        if (_ret === "continue") continue;
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"]) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    timeouts.push(setTimeout(function () {
      stop();
      play();
    }, DURATION));
  }

  function stop() {
    if (status === 0) {
      return;
    }analyser.disconnect(audioContext.destination);
    var items = panel.props.items;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var item = _step.value;

        item.gain.disconnect(analyser);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"]) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    stopWave();
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = timeouts[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var t = _step2.value;

        clearTimeout(t);
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
          _iterator2["return"]();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    timeouts = [];
    status = 0;
  }

  $("#play").click(play);
  $("#stop").click(stop);
})(window);
//# sourceMappingURL=build.js.map