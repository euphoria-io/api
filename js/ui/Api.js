import React from 'react'
import Reflux from 'reflux'

import toc from '../store/toc'

import NavLeft from './NavLeft'
import NavTop from './NavTop'

export default React.createClass({
  displayName: 'Api',

  propTypes: {
    content: React.PropTypes.string,
  },

  mixins: [
    Reflux.connect(toc.store, 'toc'),
  ],

  init() {
    this._offset = 0
  },

  onHashChange(ev) {
    const hash = window.location.hash
    if (hash && hash[0] == '#') {
      toc.setCurrent(hash.substr(1))
    }
  },

  onScroll(ev) {
    toc.scrollTo(ev.target.scrollTop)
  },

  scrollTo() {
    this._offset = this.state.toc.offset
    let api = document.getElementById('api')
    let elem = document.getElementById(this.state.toc.current)
    if (api && elem) {
      console.log('scroll to', elem.offsetTop)
      api.scrollTop = elem.offsetTop - 64
    } else {
      console.log('no api+elem to scroll')
    }
  },

  render() {
    return (
      <div>
        <NavTop />
        <div id="bottom">
          <NavLeft />
          <div id="api" dangerouslySetInnerHTML={{__html: this.props.content}} onScroll={this.onScroll} />
        </div>
      </div>
    )
  },

  reindex() {
    let api = document.getElementById('api')
    let elems = api.querySelectorAll('h1, h2')

    for (var i = 0; i < elems.length; i++) {
      if (elems[i].tagName == 'H1') {
        toc.startGroup(elems[i].id, elems[i].innerHTML, elems[i].offsetTop)
      } else {
        toc.addSection(elems[i].id, elems[i].innerHTML, elems[i].offsetTop)
      }
    }
  },

  componentDidMount() {
    if (!this.state.toc.current) {
      toc.setCurrent(window.location.hash.substr(1))
    }
    window.addEventListener('hashchange', this.onHashChange)
    this.reindex()
  },

  componentWillUnmount() {
    window.removeEventListener('hashchange', this.onHashChange)
  },

  shouldComponentUpdate() {
    if (this._offset === this.state.toc.offset) {
      return false
    }
    return true
  },

  componentDidUpdate() {
    this.scrollTo()
    //this.reindex()
  },
})
