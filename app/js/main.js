{
  let factory = PanelFactory({items: []});
  var panel = React.render(factory, document.getElementById('panel'));
  panel.setState({
    itemsStatus: []
  });
}
{
  let factory = PropertiesFactory();
  var properties = React.render(factory, document.getElementById('properties'));
}

(function(e, t) {
  $(document).ready(function() {
    $(document.body).click(function(e) {
      var $target = $(e.target);
      if($target.is('[data-modal]') || $target.parents('[data-modal]').length || 
         $target.is('.modal') || $target.parents('.modal').length) return;
      $('.modal').addClass('hide');
    });
  });
})(this);