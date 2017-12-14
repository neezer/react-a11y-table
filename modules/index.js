import React from 'react'
import FixedHeaderContainer from './FixedHeaderContainer'

class FixedContent extends React.Component {
  render () {
    const { fixedRef } = this.props

    return <h1 ref={fixedRef}>{`I'm a fixed header! w00t!`}</h1>
  }
}

const Content = () => <h1>Table goes here!</h1>

export default class A11yTable extends React.Component {
  render () {
    return (
      <FixedHeaderContainer Content={Content} FixedContent={FixedContent} />
    )
  }
}
