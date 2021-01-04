import React from 'react'

interface IProps {
  msg: string
}

const Child = (props: IProps) => <div className="textColor">{props.msg}</div>

export default Child
