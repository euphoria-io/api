import React from 'react'
import ReactDOM from 'react-dom'

import toc from './store/toc'
import TOC from './ui/TOC'

const loadedStates = ['complete', 'loaded', 'interactive']

function run() {
  toc.load()
  ReactDOM.render(<TOC />, document.getElementById('nav'))
}

if (loadedStates.includes(document.readyState) && document.body) {
  run()
} else {
  window.addEventListener('DOMContentLoaded', run, false)
}
