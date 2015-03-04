(function(global) {
  let $canvas = $('#wave-canvas'),
      $wave = $('#wave');

  let canvas = $canvas.get(0).getContext('2d');

  let stop = false;

  function stopWave() {
     stop = true;
  }

  function drawWave() {
    let bufferLength = analyser.fftSize;
    let data = new Float32Array(bufferLength);

    let WIDTH, HEIGHT, SIDE_MARGIN,
          width, canvasWidth, canvasHeight;

    function setSizes() {
      WIDTH = $canvas.width() * 0.8;
      HEIGHT = $canvas.height() * 0.6;

      SIDE_MARGIN = $canvas.width() * 0.2;
      width = WIDTH * (1.0/bufferLength);

      canvasWidth = $canvas.width();
      canvasHeight = $canvas.height();
    }

    setSizes();
    $(window).resize(setSizes);


    (function loop() {
      if(stop) {
        stop = false;
        return;
      }
      requestAnimationFrame(function() {
        analyser.getFloatTimeDomainData(data);

        canvas.clearRect(0, 0, canvasWidth, canvasHeight);
        canvas.strokeStyle = '#D51A00';
        canvas.fillStyle = '#D51A00';
        canvas.beginPath();

        let x = SIDE_MARGIN/2;

        for(let i = 0; i < bufferLength; i++) {
          let value = data[i] * HEIGHT / 2;

          canvas.rect(x, HEIGHT*0.7 - value/2, width, value);

          x += width;
        }

        canvas.fill();

        loop();
      });
    })();
  }


  $canvas.attr('width', $wave.width());
  $canvas.attr('height', $wave.height());
  $(window).resize(function() {
    $canvas.attr('width', $wave.width());
    $canvas.attr('height', $wave.height());
  });

  global.drawWave = drawWave;
  global.stopWave = stopWave;
})(window);
