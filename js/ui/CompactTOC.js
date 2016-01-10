import React from 'react'
import ReactDOM from 'react-dom'
import Reflux from 'reflux'

import toc from '../store/toc'

export default React.createClass({
  displayName: 'CompactTOC',

  mixins: [
    Reflux.connect(toc.store, 'toc'),
  ],

  onChange(ev) {
    window.location.hash = '#'+ev.target.value
  },

  componentDidUpdate() {
    if (this.state.toc.scrolledTo) {
      let elem = ReactDOM.findDOMNode(this)
      elem.value = this.state.toc.scrolledTo
    }
  },

  render() {
    return (
      <select id="toc-selector" onChange={this.onChange}>
        {this.state.toc.groups.valueSeq().map(group =>
          <optgroup key={group.id} label={group.label}>
            {group.sections.map(section =>
              <option key={section.id} value={section.id}>{section.label}</option>
            )}
          </optgroup>
        )}
      </select>
    )
  },
})
