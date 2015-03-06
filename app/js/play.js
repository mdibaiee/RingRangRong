(function(global) {
  let timeouts = [];

  let status = 0;

  const DURATION = 10*1000;

  function play() {
    let items = panel.props.items;

    let hasOn = items.some(function(a) {
      return a.connected;
    });

    if(status === 1 || !items.length || !hasOn) return;
    timeouts = [];
    status = 1;

    analyser.connect(audioContext.destination);
    drawWave();

    for(let item of items) {
      if(!item.connected) continue;
      let range = item.range;

      for(let i = 0, len = range.length; i < len; i+=2) {
        if(typeof range[i] === 'undefined') {
          i--;
          continue;
        }

        let pair = range.slice(i, i+2);
        timeouts.push(
          setTimeout(() => {
            item.gain.connect(analyser);
          }, pair[0]*DURATION),
          setTimeout(() => {
            item.gain.disconnect(analyser);
          }, pair[1]*DURATION)
        );
      }
    }

    timeouts.push(setTimeout(() => {
      stop();
      play();
    }, DURATION));
  }

  function stop() {
    if(status === 0) return;
    analyser.disconnect(audioContext.destination);
    let items = panel.props.items;
    for(let item of items) {
      item.gain.disconnect(analyser);
    }

    stopWave();
    for(let t of timeouts) {
      clearTimeout(t);
    }
    timeouts = [];
    status = 0;
  }


  $('#play').click(play);
  $('#stop').click(stop);
})(window);
