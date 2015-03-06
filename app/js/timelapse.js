(function(global) {
  function initTimelapses() {
    let $panel = $('#panel');
    let $timelapses = $('[id^="i-"]');

    const width = $panel.width() * 0.8;
    const height = 30;
    const distance = width / 100;

    $timelapses.each(function(e) {
      this.width = width;
      this.height = height;

      let id = this.id.slice(2);
      let item = panel.props.items[+id];

      let c = this.getContext('2d');
      c.clearRect(0, 0, width, height);
      c.fillStyle = 'white';

      c.beginPath();
      for(let i = 0; i < 100; i++) {
        let h = i % 10 === 0 ? 20 : 10;
        c.rect(i*distance, height-h, 2, h);
      }

      c.fill();
      c.closePath();

      c.fillStyle = 'rgba(255, 110, 110, 0.6)';

      for(let i = 0, len = item.range.length; i < len; i++) {
        let [start, end] = item.range.slice(i, i+2);
        if(typeof end === 'undefined' || typeof start === 'undefined') continue;
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

  $('.tools .fa-scissors').click(function() {
    let $timelapses = $('[id^="i-"]');

    $timelapses.removeClass().addClass('cut');
  });

  $('.tools .fa-plus').click(function() {
    let $timelapses = $('[id^="i-"]');

    $timelapses.removeClass().addClass('add');
  });

  $('.tools .fa-compress').click(function() {
    let $timelapses = $('[id^="i-"]');

    $timelapses.removeClass().addClass('merge');
  });

  $('.tools .fa-trash-o').click(function() {
    let $timelapses = $('[id^="i-"]');

    $timelapses.removeClass().addClass('delete');
  });

  global.initTimelapses = initTimelapses;
})(window);
