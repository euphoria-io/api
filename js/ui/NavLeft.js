import React from 'react'
import Reflux from 'reflux'

import toc from '../store/toc'

import NavLeft from './NavLeft'

export default React.createClass({
  displayName: 'NavLeft',

  mixins: [
    Reflux.connect(toc.store, 'toc'),
  ],

  onChange(ev) {
    window.location.hash = '#'+ev.target.value
  },

  render() {
    return (
      <div id="nav-left">
        <ul>
          {this.state.toc.groups.valueSeq().map(group =>
            <li className={this.getClassName(group.id)}>
              <a href={'#'+group.id}>{group.label}</a>
              <ul>
                {group.sections.map(section =>
                  <li className={this.getClassName(section.id)}>
                    <a href={'#'+section.id}>{section.label}</a>
                  </li>
                )}
              </ul>
            </li>
          )}
        </ul>
      </div>
    )
  },

  getClassName(id) {
    if (id === this.state.toc.scrolledTo) {
      return "current"
    } else {
      return ""
    }
  },
})

