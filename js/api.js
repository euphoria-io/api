import React from 'react'
import ReactDOM from 'react-dom'

import toc from './store/toc'
import Api from './ui/Api'

const loadedStates = ['complete', 'loaded', 'interactive']

function run() {
  let noscriptElem = document.getElementById('noscript')
  let contentElem = document.getElementById('content')
  let content = contentElem.innerHTML
  noscriptElem.remove()
  ReactDOM.render(<Api content={noscriptElem.innerHTML}/>, contentElem)
}

if (loadedStates.includes(document.readyState) && document.body) {
  run()
} else {
  window.addEventListener('DOMContentLoaded', run, false)
}
