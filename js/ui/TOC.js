import React from 'react'
import Reflux from 'reflux'

import toc from '../store/toc'

export default React.createClass({
  displayName: 'toc',

  mixins: [
    Reflux.connect(toc.store, 'toc'),
  ],

  render() {
    return (
      <select id="toc">
        {this.state.toc.items.toSeq().map(item=>
          <option key={item.anchor.href} value={item.anchor.href}>
            {''.repeat(item.depth)+item.anchor.text}
          </option>
        )}
      </select>
    )
  },
})
