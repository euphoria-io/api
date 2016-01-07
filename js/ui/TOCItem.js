import Immutable from 'immutable'
import React from 'react'
import Reflux from 'reflux'

var TOCItem = React.createClass({
  displayName: 'TOCItem',

  propTypes: {
    item: React.PropTypes.object,
  },

  render() {
    let item = this.props.item
    if (item.children) {
      return (
        <optgroup label={item.anchor.text}>
          {item.children.map(x=> <TOCItem key={x.anchor.href} item={x} />)}
        </optgroup>
      )
    }

    return (
      <option key={item.anchor.href} value={item.anchor.href}>{item.anchor.text}</option>
    )
  },
})
export default TOCItem
