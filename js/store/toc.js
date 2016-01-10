import _ from 'lodash'
import Immutable from 'immutable'
import Reflux from 'reflux'

const storeActions = Reflux.createActions([
  'addSection',
  'load',
  'scrollTo',
  'setCurrent',
  'startGroup',
])
_.extend(module.exports, storeActions)

const store = module.exports.store = Reflux.createStore({
  listenables: storeActions,

  init() {
    this.state = {
      index: Immutable.OrderedMap(),
      groups: Immutable.OrderedMap(),
      current: null,
      scrolledTo: null,
      offset: 0,
    }
  },

  getInitialState() {
    return this.state
  },

  startGroup(id, label, offsetTop) {
    if (this.state.index.has(id)) {
      return
    }

    let group = {
      id: id,
      label: label,
      sections: Immutable.List(),
    }

    this.state.index = this.state.index.set(id, offsetTop)
    this.state.groups = this.state.groups.set(id, group)
    this.trigger(this.state)
  },

  addSection(id, label, offsetTop) {
    let known = this.state.index.get(id)
    if (known !== undefined) {
      if (offsetTop != known) {
        this.state.index.set(id, offsetTop)
        this.trigger(this.state)
      }
      return
    }

    this.state.index = this.state.index.set(id, offsetTop)

    let group = this.state.groups.last()
    let section = {
        id: id,
        label: label,
    }
    group.sections = group.sections.push(section)
    this.state.groups = this.state.groups.set(group.id, group)
    this.trigger(this.state)
  },

  setCurrent(id) {
    this.state.current = id
    this.state.scrolledTo = id
    this.state.offset = this.state.index.get(this.state.current, 0)
    this.trigger(this.state)
  },

  scrollTo(offset) {
    let key
    this.state.index.forEach((v, k, i) => {
      let elem = document.getElementById(k)
      if (elem && elem.offsetTop > offset+65) {
        return 0
      }
      key = k
      return 1
    })
    if (key && key !== this.state.scrolledTo /*&& !this.state.groups.has(key)*/) {
      this.state.scrolledTo = key
      this.trigger(this.state)
    }
  },
})
