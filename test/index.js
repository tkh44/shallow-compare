/* eslint-env mocha */
import expect from 'expect'
import { h, render, rerender, Component } from 'preact'
import shallowCompare from '../src/index'
import undom from 'undom'

Object.assign(global, undom())

describe('Shallow Compare', () => {
  let scratch

  before(() => {
    scratch = document.createElement('div')
    document.documentElement.appendChild(scratch)
  })

  beforeEach(() => {
    scratch.innerHTML = ''
  })

  after(() => {
    scratch.parentNode.removeChild(scratch)
    scratch = null
  })

  it('only renders state changes', () => {
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
        return h('div', null, 'test')
      }
    }

    render(h(ShallowTestComponent, {}), scratch)
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

  it.only('only renders props changes', () => {
    let renderCalls = 0
    let setState

    class ShallowTestComponent extends Component {
      shouldComponentUpdate (nextProps, nextState) {
        console.log()
        console.log('prevProps', JSON.stringify(this.props))
        console.log('nextProps', JSON.stringify(nextProps))
        console.log('shouldComponentUpdate', shallowCompare(this, nextProps, nextState))
        return shallowCompare(this, nextProps, nextState)
      }

      render () {
        ++renderCalls
        console.log('render', this.props.color)
        return h('div', {}, this.props.color, this.props.children)
      }
    }

    class Container extends Component {
      constructor (props) {
        super(props)
        this.state = { color: 'red' }
        setState = this.setState.bind(this)
      }

      render () {
        return h(ShallowTestComponent, { color: this.state.color }, 'test')
      }
    }

    render(h(Container, {}), scratch)
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
