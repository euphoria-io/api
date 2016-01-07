import _ from 'lodash'
import Immutable from 'immutable'
import Reflux from 'reflux'

const storeActions = Reflux.createActions([
  'load',
])
_.extend(module.exports, storeActions)

const store = module.exports.store = Reflux.createStore({
  listenables: storeActions,

  init() {
    this.state = {
      items: Immutable.List(),
    }
  },

  getInitialState() {
    return this.state
  },

  load() {
    let items = Immutable.List()

    // for each li:
    //   get inner text of a for label
    //   look for ul to recurse on
    //

    function visit(group, li, depth) {
      let item = {
        depth: depth,
      }

      let aElems = li.getElementsByTagName("a")
      if (aElems.length > 0) {
        item.anchor = aElems[0]
      }

      let ulElems = li.getElementsByTagName("ul")
      if (ulElems.length > 0) {
        item.children = visitUL(ulElems[0], depth+1)
      }

      if (item.anchor || item.children) {
        return group.push(item)
      }

      return group
    }

    function visitUL(ul, depth) {
      let group = Immutable.List()
      for (var i = 0; i < ul.children.length; i++) {
        if (ul.children[i].tagName == "LI") {
          group = visit(group, ul.children[i], depth+1)
        }
      }
      return group
    }

    let ul = document.getElementsByTagName("ul")
    if (ul.length > 0) {
      this.state.items = visitUL(ul[0], 0)
      this.trigger(this.state)
    }
  },
})
