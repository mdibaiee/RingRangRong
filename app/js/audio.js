(function(global) {
  var audioContext = new (window.AudioContext || window.webkitAudioContext)();
  var analyser = audioContext.createAnalyser();

  $('#add-oscillator').click(e => {
    let oscillator = audioContext.createOscillator(),
        gain = audioContext.createGain();

    let types = ['sine','square',
                 'sawtooth','triangle'];

    let newLine = {
      name: 'Oscillator ' + (panel.props.items.length + 1),
      oscillator: oscillator,
      gain: gain,
      connected: false,
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
          if(!types.includes(value)) return;

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
      itemsStatus: panel.state.itemsStatus.concat(false)
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
        connected: false,
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
        itemsStatus: panel.state.itemsStatus.concat(false)
      });
      panel.setProps({
        items: panel.props.items.concat(newLine)
      });
    }, e => {});
  });

  global.audioContext = audioContext;
  global.analyser = analyser;
})(window);
