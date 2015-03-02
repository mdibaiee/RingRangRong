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