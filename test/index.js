/* eslint-env mocha */
import expect from 'expect'
import { h, render, rerender, Component as PreactComponent } from 'preact'
import { Component as ReactComponent, createElement } from 'react'
import ReactTestUtils from 'react-addons-test-utils'
import shallowCompare from '../src/index'

describe('Preact', () => {
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

    class ShallowTestComponent extends PreactComponent {
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
    setState({ color: 'red' })
    rerender()
    expect(renderCalls).toBe(3)
  })

  it('only renders props changes', () => {
    let renderCalls = 0
    let setState

    class ShallowTestComponent extends PreactComponent {
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

    class Container extends PreactComponent {
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
    setState({ color: 'red' })
    rerender()
    expect(renderCalls).toBe(3)
  })
})

describe('React', () => {
  it('only renders state changes', () => {
    let renderCalls = 0

    class ShallowTestComponent extends ReactComponent {
      constructor (props, context) {
        super(props, context)
        this.state = { color: 'red' }
      }

      shouldComponentUpdate (nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState)
      }

      render () {
        ++renderCalls
        return createElement('div', null, 'test')
      }
    }

    const instance = ReactTestUtils.renderIntoDocument(createElement(ShallowTestComponent))
    expect(renderCalls).toBe(1)
    instance.setState({ color: 'blue' })
    expect(renderCalls).toBe(2)
    instance.setState({ color: 'blue' })
    expect(renderCalls).toBe(2)
    instance.setState({ color: 'red' })
    expect(renderCalls).toBe(3)
  })

  it('only renders props changes', () => {
    let renderCalls = 0

    class ShallowTestComponent extends ReactComponent {
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
        return createElement('div', {}, this.props.color, this.props.children)
      }
    }

    class Container extends ReactComponent {
      constructor (props) {
        super(props)
        this.state = { color: 'red' }
      }

      render () {
        return createElement(ShallowTestComponent, { color: this.state.color }, 'test')
      }
    }

    const instance = ReactTestUtils.renderIntoDocument(createElement(Container))
    expect(renderCalls).toBe(1)
    instance.setState({ color: 'blue' })
    expect(renderCalls).toBe(2)
    instance.setState({ color: 'blue' })
    expect(renderCalls).toBe(2)
    instance.setState({ color: 'red' })
    expect(renderCalls).toBe(3)
  })
})
