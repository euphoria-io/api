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
    let value = this.state.toc.scrolledTo
    if (value) {
      let elem = ReactDOM.findDOMNode(this)
      if (this.state.toc.groups.has(value)) {
        let first = this.state.toc.groups.get(value).sections.first()
        value = first && first.id
      }
      elem.value = value
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
