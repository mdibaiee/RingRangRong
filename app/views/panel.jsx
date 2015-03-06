var PanelView = React.createClass({
  toggleConnect(index) {
    let item = this.props.items[index];

    item.connected = !item.connected;

    this.state.itemsStatus[index] = item.connected;

    this.setState({
      itemsStatus: this.state.itemsStatus
    });
  },
  showProps(index) {
    let item = this.props.items[index];
    properties.setProps({item: item.properties});
  },
  names() {
    return this.props.items.map((item, index) => {
      return <li key={index}
                 onClick={this.showProps.bind(this, index)}>
        <span className={this.state.itemsStatus[index] ? 'fa fa-dot-circle-o' : 'fa fa-circle-o'}
              onClick={this.toggleConnect.bind(this, index)}></span>
        {item.name}
      </li>
    });
  },
  timelapses() {
    return this.props.items.map((item, index) => {
      return <canvas id={'i-'+index} key={index}
              onClick={this.timelapseAction.bind(this, index)}
              onMouseMove={this.showRange.bind(this, index)}></canvas>;
    });
  },
  timelapseAction(index, e) {
    let item = this.props.items[index];

    let $el = $('#i-'+index),
        cls = $el.attr('class');

    let width = $el.width();
    let n = map(e.pageX - $el.offset().left, 0, width, 0, 1);

    let ind = 0;

    let before = item.range.reduce((a, b, i) => {
      return b >= a && b < n ? (ind = i, b) : a;
    }, -Infinity);

    if(cls === 'cut') {
      item.range.splice(ind, 1, before, n);
    }
    if(cls === 'delete') {
      item.range.splice(ind, 1, before, undefined);
    }
    if(cls === 'merge') {
      console.log(item.range, ind);
      if(item.range[ind+1] !== undefined) return;
      item.range.splice(ind, 3);
    }
    if(cls === 'add') {
      if(item.range[ind+1] !== undefined) return;

      if(!this.state.firstAdd) {
        this.state.firstAdd = n;
        return;
      }
      item.range.splice(ind+1, 1, undefined, this.state.firstAdd, n, undefined);
      this.state.firstAdd = false;
    }

    initTimelapses();
  },
  showRange(index, e) {
    if(!this.state.firstAdd) return;

    let $canvas = document.getElementById('i-'+index);
    let c = $canvas.getContext('2d');

    initTimelapses();
    c.fillStyle = '#6E0201';
    let start = this.state.firstAdd*$canvas.width,
        end = e.pageX - $canvas.offsetLeft - start;

    c.fillRect(start, 0, end, 30);
  },
  componentDidUpdate() {
    initTimelapses();
  },
  componentDidMount() {
    let $panel = $('#panel');

    $panel.on('mousemove', 'canvas', (e) => {
      let $canvas = $(e.target);
      let width = $canvas.width();
      let offset = $canvas.offset();
      let toten = map(e.pageX, offset.left, offset.left+width, 0, 10).toFixed(1);

      $canvas.tooltip(toten, {
        x: e.pageX,
        y: offset.top + $canvas.height()
      });
    });
    $panel.on('mouseout', 'canvas', e => {
      jQuery.fn.tooltip(false);
    })
  },
  render() {
    return <div>
      <ul className='names'>
        {this.names()}
      </ul>
      <ul className='timelapse'>
        {this.timelapses()}
      </ul>
    </div>;
  }
});

var PanelFactory = React.createFactory(PanelView);