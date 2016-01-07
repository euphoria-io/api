import React from 'react'
import Reflux from 'reflux'

import toc from '../store/toc'

import TOCItem from './TOCItem'

export default React.createClass({
  displayName: 'TOC',

  mixins: [
    Reflux.connect(toc.store, 'toc'),
  ],

  onChange(ev) {
    window.location = ev.target.value
  },

  render() {
    return (
      <select id="toc-selector" onChange={this.onChange}>
        {this.state.toc.items.map(item => <TOCItem key={item.anchor.href} item={item} />)}
      </select>
    )
  },
})
