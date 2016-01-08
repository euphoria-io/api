import React from 'react'
import ReactDOM from 'react-dom'

import toc from './store/toc'
import TOC from './ui/TOC'

const loadedStates = ['complete', 'loaded', 'interactive']

function run() {
  toc.load()
  ReactDOM.render(<TOC />, document.getElementById('toc'))
  window.addEventListener('hashchange', navigate, false)
  navigate()
}

function navigate() {
  const hash = window.location.hash

  if (hash && hash[0] == '#') {
    const target = hash.substr(1)

    console.log('navigate to', window.location.href)
    let selector = document.getElementById('toc-selector')
    for (var i = 0; i < selector.options.length; i++) {
      if (selector.options[i].value === window.location.href) {
        if (selector.selectedIndex != i) {
          selector.selectedIndex = i
        }
      }
    }

    let api = document.getElementById('api')
    let elem = document.getElementById(target)
    api.scrollTop = elem.offsetTop - 64
  }
}

if (loadedStates.includes(document.readyState) && document.body) {
  run()
} else {
  window.addEventListener('DOMContentLoaded', run, false)
}
