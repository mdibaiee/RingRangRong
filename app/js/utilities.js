(function(global) {
  const map = (a, oldMin, oldMax, min, max) => {
    return (a - oldMin)/(oldMax-oldMin) * (max-min) + min;
  };

  const $tooltip = $('#tooltip');

  $.fn.tooltip = function(text, coords) {
    if(text === false) {
      $tooltip.addClass('hide');
      return;
    }
    $tooltip.removeClass('hide');
    $tooltip.text(text);

    $tooltip.css({
      'left': coords.x,
      'top': coords.y
    });
  };

  global.map = map;
  global.tooltip = tooltip;
})(window);
