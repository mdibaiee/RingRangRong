(function(global) {
  var audioContext = new (window.AudioContext || window.webkitAudioContext)();
  var analyser = audioContext.createAnalyser();

  let $selectBeep = $('#select-beep'),
      $addBeep = $('#add-beep');

  $addBeep.click(e => {
    $selectBeep.removeClass('hide');
  });

  $selectBeep.on('click', 'span', e => {
    let id = parseInt(e.target.textContent.trim(), 10) - 1;

    let $audio = $('#audio-'+id);
    if(!$audio.length) {
      $audio = $('<audio id="audio' + id + '" src="/app/beeps/' + id + '.mp3"></audio>');
      let audio = $audio.get(0);
      audio.src = '/app/beeps/' + id + '.mp3';
      audio.loop = true;
      $audio.on('canplay', e => {
        audio.play();
      });

      $(document.body).append($audio);
    }

    let beep = audioContext.createMediaElementSource($audio.get(0)),
        gain = audioContext.createGain();

    let newLine = {
      name: '[' + (id+1) + '] Beep ' + (panel.props.items.length + 1),
      oscillator: beep,
      gain: gain,
      connected: true,
      range: [0, 1],
      properties: {
        set volume(value) {
          if(typeof value !== 'number') return;

          gain.gain.value = value / 100;
        },
        get volume() {
          return parseInt(Math.round(gain.gain.value * 100));
        },
        types: {
          volume: {
            type: 'number'
          }
        }
      } 
    };

    beep.connect(gain);

    panel.setState({
      itemsStatus: panel.state.itemsStatus.concat(true)
    });
    panel.setProps({
      items: panel.props.items.concat(newLine)
    });

    $selectBeep.addClass('hide');
  });

  $('#add-oscillator').click(e => {
    let oscillator = audioContext.createOscillator(),
        gain = audioContext.createGain();

    let types = ['sine','square',
                 'sawtooth','triangle'];

    let newLine = {
      name: 'Oscillator ' + (panel.props.items.length + 1),
      oscillator: oscillator,
      gain: gain,
      connected: true,
      range: [0, 1],
      properties: {
        set frequency(value) {
          if(typeof value !== 'number') return;
          
          oscillator.frequency.value = value;
        },
        get frequency() {
          return oscillator.frequency.value;
        },
        set detune(value) {
          if(typeof value !== 'number') return;

          oscillator.detune.value = value;
        },
        get detune() {
          return oscillator.detune.value;
        },
        set type(value) {
          if(types.indexOf(value) === -1) return;

          oscillator.type = value;
        },
        get type() {
          return oscillator.type;
        },
        set volume(value) {
          if(typeof value !== 'number') return;

          gain.gain.value = value / 100;
        },
        get volume() {
          return parseInt(Math.round(gain.gain.value * 100));
        },
        types: {
          frequency: {
            type: 'number',
          },
          detune: {
            type: 'number',
          },
          type: {
            type: 'select',
            options: types
          },
          volume: {
            type: 'number'
          }
        }
      },

    };

    oscillator.start();
    oscillator.connect(gain);

    panel.setState({
      itemsStatus: panel.state.itemsStatus.concat(true)
    });
    panel.setProps({
      items: panel.props.items.concat(newLine)
    });
  });

  $('#add-stream').click(e => {
    navigator.getUserMedia({audio: true}, stream => {
      let stream = audioContext.createMediaStreamSource(stream),
          gain = audioContext.createGain();

      let newLine = {
        name: 'Line In ' + (panel.props.items.length + 1),
        oscillator: stream,
        gain: gain,
        connected: true,
        range: [0, 1],
        properties: {
          set volume(value) {
            if(typeof value !== 'number') return;

            gain.gain.value = value / 100;
          },
          get volume() {
            return parseInt(Math.round(gain.gain.value * 100));
          },
          types: {
            volume: {
              type: 'number'
            }
          }
        }
      };

      stream.connect(gain);

      panel.setState({
        itemsStatus: panel.state.itemsStatus.concat(true)
      });
      panel.setProps({
        items: panel.props.items.concat(newLine)
      });
    }, e => {});
  });

  global.audioContext = audioContext;
  global.analyser = analyser;
})(window);
