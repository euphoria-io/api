import React from 'react'
import Reflux from 'reflux'

import CompactTOC from './CompactTOC'

export default React.createClass({
  displayName: 'NavTop',

  render() {
    return (
      <div id="nav">
        <div className="logo">
          <a href="/">Euphoria API</a>
        </div>
        <div id="compact-toc">
          <CompactTOC />
        </div>
      </div>
    )
  },
})
