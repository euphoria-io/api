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

    function visit(li, depth) {
      let aElems = li.getElementsByTagName("a")
      if (aElems.length > 0) {
        let item = {
          anchor: aElems[0],
          depth: depth,
        }
        console.log("adding item:", item.anchor.text)
        items = items.push(item)
      }

      let ulElems = li.getElementsByTagName("ul")
      if (ulElems.length > 0) {
        visitUL(ulElems[0], depth+1)
      }
    }

    function visitUL(ul, depth) {
      for (var i = 0; i < ul.children.length; i++) {
        if (ul.children[i].tagName == "LI") {
          visit(ul.children[i], depth+1)
        }
      }
    }

    let ul = document.getElementsByTagName("ul")
    if (ul.length > 0) {
      visitUL(ul[0], 0)
      this.state.items = items
      this.trigger(this.state)
    }
  },
})
