"use strict";

var PanelView = React.createClass({ displayName: "PanelView",
  toggleConnect: function toggleConnect(index) {
    var item = this.props.items[index];

    item.connected = !item.connected;

    this.state.itemsStatus[index] = item.connected;

    if (item.connected) {
      item.gain.connect(audioContext.destination);
      item.gain.connect(analyser);
    } else {
      item.gain.disconnect(audioContext.destination);
      item.gain.disconnect(analyser);
    }

    this.setState({
      itemsStatus: this.state.itemsStatus
    });
  },
  showProps: function showProps(index) {
    var item = this.props.items[index];
    properties.setProps({ item: item.properties });
  },
  names: function names() {
    var _this = this;

    return this.props.items.map(function (item, index) {
      return React.createElement("li", { key: index,
        onClick: _this.showProps.bind(_this, index) }, React.createElement("span", { className: _this.state.itemsStatus[index] ? "fa fa-dot-circle-o" : "fa fa-circle-o",
        onClick: _this.toggleConnect.bind(_this, index) }), item.name);
    });
  },
  timelapses: function timelapses() {
    var els = this.props.items.map(function (item, index) {
      return React.createElement("canvas", { id: "i-" + index });
    });
    return els;
  },
  render: function render() {
    return React.createElement("div", null, React.createElement("ul", { className: "names" }, this.names()), React.createElement("ul", { className: "timelapse" }, this.timelapses()));
  }
});

var PanelFactory = React.createFactory(PanelView);
var PropertiesView = React.createClass({ displayName: "PropertiesView",
  updateProp: function updateProp(prop) {
    var el = this.refs[prop].getDOMNode();
    var item = this.props.item;
    item[prop] = parseInt(el.value, 10) || el.value;

    this.setProps({
      item: item
    });
  },
  input: function input(prop) {
    var value = this.props.item[prop];
    var type = this.props.item.types[prop];
    if (type.type === "select") {
      return React.createElement("select", { value: value, ref: prop, onChange: this.updateProp.bind(this, prop) }, type.options.map(function (opt) {
        return React.createElement("option", { value: opt }, opt);
      }));
    } else {
      return React.createElement("input", { value: value, ref: prop, type: type.type, onChange: this.updateProp.bind(this, prop) });
    }
  },
  propertyList: function propertyList() {
    var els = [];
    for (var prop in this.props.item) {
      if (prop === "types") continue;
      els.push(React.createElement("li", { key: prop }, React.createElement("span", null, prop), this.input(prop)));
    }
    return els;
  },
  render: function render() {
    if (!this.props.item) {
      return React.createElement("span", null);
    }return React.createElement("ul", { className: "properties" }, React.createElement("p", null, "Properties"), this.propertyList());
  }
});

var PropertiesFactory = React.createFactory(PropertiesView);
//# sourceMappingURL=views.js.map