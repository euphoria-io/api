import React from 'react'
import ReactDOM from 'react-dom'

import toc from './store/toc'
import Api from './ui/Api'

const loadedStates = ['complete', 'loaded', 'interactive']

function run() {
  let contentElem = document.getElementById('content')
  let tocElem = contentElem.getElementsByTagName('ul')[0]
  tocElem.remove()
  ReactDOM.render(<Api content={contentElem.innerHTML}/>, contentElem)
}

if (loadedStates.includes(document.readyState) && document.body) {
  run()
} else {
  window.addEventListener('DOMContentLoaded', run, false)
}
