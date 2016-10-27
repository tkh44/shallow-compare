/* eslint-env mocha */
import expect from 'expect'
import { h, render, rerender, Component } from 'preact'
import shallowCompare from '../src/index'
import undom from 'undom'

const document = undom()
global.document = document

describe('Preact Shallow Compare', () => {
  let scratch

  before(() => {
    scratch = document.createElement('div');
    (document.body || document.documentElement).appendChild(scratch)
  })

  beforeEach(() => {
    scratch.innerHTML = ''
  })

  after(() => {
    scratch.parentNode.removeChild(scratch)
    scratch = null
  })

  it('only renders when props or state changes', () => {
    let renderCalls = 0
    let setState

    class ShallowTestComponent extends Component {
      constructor (props, context) {
        super(props, context)

        this.state = {
          color: 'red'
        }

        setState = this.setState.bind(this)
      }

      shouldComponentUpdate (nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState)
      }

      render () {
        ++renderCalls
        return h('div', null, this.props.fieldA)
      }
    }

    render(h(ShallowTestComponent, { fieldA: 1 }), scratch)
    expect(renderCalls).toBe(1)
    rerender()
    expect(renderCalls).toBe(1)
    setState({ color: 'blue' })
    rerender()
    expect(renderCalls).toBe(2)
    setState({ color: 'blue' })
    rerender()
    expect(renderCalls).toBe(2)
    setState({ size: 'large' })
    rerender()
    expect(renderCalls).toBe(3)
  })
})
