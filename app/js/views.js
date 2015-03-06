"use strict";

var PanelView = React.createClass({ displayName: "PanelView",
  toggleConnect: function toggleConnect(index) {
    var item = this.props.items[index];

    item.connected = !item.connected;

    this.state.itemsStatus[index] = item.connected;

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
    var _this = this;

    return this.props.items.map(function (item, index) {
      return React.createElement("canvas", { id: "i-" + index, key: index,
        onClick: _this.timelapseAction.bind(_this, index),
        onMouseMove: _this.showRange.bind(_this, index) });
    });
  },
  timelapseAction: function timelapseAction(index, e) {
    var item = this.props.items[index];

    var $el = $("#i-" + index),
        cls = $el.attr("class");

    var width = $el.width();
    var n = map(e.pageX - $el.offset().left, 0, width, 0, 1);

    var ind = 0;

    var before = item.range.reduce(function (a, b, i) {
      return b >= a && b < n ? (ind = i, b) : a;
    }, -Infinity);

    if (cls === "cut") {
      item.range.splice(ind, 1, before, n);
    }
    if (cls === "delete") {
      item.range.splice(ind, 1, before, undefined);
    }
    if (cls === "merge") {
      console.log(item.range, ind);
      if (item.range[ind + 1] !== undefined) {
        return;
      }item.range.splice(ind, 3);
    }
    if (cls === "add") {
      if (item.range[ind + 1] !== undefined) {
        return;
      }if (!this.state.firstAdd) {
        this.state.firstAdd = n;
        return;
      }
      item.range.splice(ind + 1, 1, undefined, this.state.firstAdd, n, undefined);
      this.state.firstAdd = false;
    }

    initTimelapses();
  },
  showRange: function showRange(index, e) {
    if (!this.state.firstAdd) {
      return;
    }var $canvas = document.getElementById("i-" + index);
    var c = $canvas.getContext("2d");

    initTimelapses();
    c.fillStyle = "#6E0201";
    var start = this.state.firstAdd * $canvas.width,
        end = e.pageX - $canvas.offsetLeft - start;

    c.fillRect(start, 0, end, 30);
  },
  componentDidUpdate: function componentDidUpdate() {
    initTimelapses();
  },
  componentDidMount: function componentDidMount() {
    var $panel = $("#panel");

    $panel.on("mousemove", "canvas", function (e) {
      var $canvas = $(e.target);
      var width = $canvas.width();
      var offset = $canvas.offset();
      var toten = map(e.pageX, offset.left, offset.left + width, 0, 10).toFixed(1);

      $canvas.tooltip(toten, {
        x: e.pageX,
        y: offset.top + $canvas.height()
      });
    });
    $panel.on("mouseout", "canvas", function (e) {
      jQuery.fn.tooltip(false);
    });
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