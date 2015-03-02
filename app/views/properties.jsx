var PropertiesView = React.createClass({
  updateProp(prop) {
    let el = this.refs[prop].getDOMNode();
    let item = this.props.item;
    item[prop] = parseInt(el.value, 10) || el.value;

    this.setProps({
      item: item
    })
  },
  input(prop) {
    let value = this.props.item[prop];
    let type = this.props.item.types[prop];
    if(type.type === 'select') {
      return <select value={value} ref={prop} onChange={this.updateProp.bind(this, prop)}>
        {type.options.map(opt => {
          return <option value={opt}>{opt}</option>
        })}
      </select>;
    } else {
      return <input value={value} ref={prop} type={type.type} onChange={this.updateProp.bind(this, prop)}/>
    }
  },
  propertyList() {
    let els = [];
    for(let prop in this.props.item) {
      if(prop === 'types') continue;
      els.push(
        <li key={prop}>
          <span>{prop}</span>
          {this.input(prop)}
        </li>
      );
    }
    return els;
  },
  render() {
    if(!this.props.item) return <span></span>;
    return <ul className='properties'>
      <p>Properties</p>
      {this.propertyList()}
    </ul>
  }
});

var PropertiesFactory = React.createFactory(PropertiesView);