import React from 'react'

class DefaultFixedContent extends React.Component {
  return () {
    const { fixedRef } = this.props

    return <div ref={fixedRef} />
  }
}

class Container extends React.Component {
  render () {
    const { containerRef, children, onScroll, className } = this.props

    return (
      <div ref={containerRef} onScroll={onScroll} className={className}>
        {children}
      </div>
    )
  }
}

export default class FixedHeaderContainer extends React.Component {
  constructor (props) {
    super(props)

    this._scrollX = 0
    this._scrollY = 0
    this._scrolling = false

    this.containerRef = node => (this.containerNode = node)
    this.fixedRef = node => (this.fixedNode = node)

    this.onScroll = event => {
      this._scrollX = event.target.scrollLeft
      this._scrollY = event.target.scrollTop

      this.requestScrollUpdate(this.fixedNode)
    }
  }

  requestScrollUpdate (node) {
    if (!this._scrolling) {
      window.requestAnimationFrame(() => {
        this._scrolling = false

        node.style.left = `${this._scrollX}px`
        node.style.top = `${this._scrollY}px`
      })
    }

    this._scrolling = true
  }

  render () {
    const { Content, FixedContent, className } = this.props
    const containerProps = {
      className,
      containerRef: this.containerRef,
      onScroll: this.onScroll
    }

    return (
      <Container {...containerProps}>
        <FixedContent fixedRef={this.fixedRef} />
        <Content />
      </Container>
    )
  }
}

FixedHeaderContainer.defaultProps = {
  FixedContent: DefaultFixedContent
}
