import React from 'react'
import ReactDOM from 'react-dom'
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
            <li key={group.id} className={this.getClassName(group.id)}>
              <a href={'#'+group.id}>{group.label}</a>
              <ul>
                {group.sections.map(section =>
                  <li key={section.id} className={this.getClassName(section.id)}>
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
      return 'current'
    } else {
      return ''
    }
  },

  componentDidUpdate() {
    let nav = ReactDOM.findDOMNode(this)
    let margin = 0.15 * nav.scrollHeight
    let elems = nav.querySelectorAll('.current')
    if (!elems) {
      return
    }
    let e = elems[0]
    if (!e) {
      return
    }
    if (nav.scrollTop+margin > e.offsetTop) {
      nav.scrollTop = e.offsetTop-margin
    } else if (nav.scrollTop+nav.offsetHeight-margin < e.offsetTop+e.offsetHeight) {
      nav.scrollTop = e.offsetTop+e.offsetHeight+margin-nav.offsetHeight
    }
  },
})
