var PanelView = React.createClass({
  toggleConnect(index) {
    let item = this.props.items[index];

    item.connected = !item.connected;

    this.state.itemsStatus[index] = item.connected;

    if(item.connected) {
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
    let els = this.props.items.map((item, index) => {
      return <canvas id={'i-'+index}></canvas>;
    });

    els.forEach(el => {
      let c = el.getContext('2d');

      
    });
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