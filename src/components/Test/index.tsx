import React from 'react'
import Child from 'components/Child/index'
import Count from 'components/Count/index'

export default class Test extends React.Component {
  state = {
    msg: 'hello, world!!!'
  }

  render() {
    const { msg } = this.state
    return (
      <React.Fragment>
        <Child msg={msg}/>
        <Count />
      </React.Fragment>
    )
  }
}
