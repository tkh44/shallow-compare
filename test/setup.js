import { jsdom } from 'jsdom' // React requires more than undom
import undom from 'undom' // jsdom is missing some features that undom has

const exposedProperties = ['window', 'navigator', 'document']
global.document = jsdom('')
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property)
    global[property] = document.defaultView[property]
  }
})

global.navigator = { userAgent: 'node.js' }
global.documentRef = document

const { Text, SVGElement, Element } = undom()
Object.assign(global, { Text, SVGElement, Element }) // Make preact testing work
