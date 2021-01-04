import React, { useState } from 'react'

const Count = () => {

  const [count, setCount] = useState(0);
  const [msg] = useState("显示一个计数器!");

  return (
    <div>
      <p className="countText">{msg}</p>
      <div>
        <button onClick={() => { setCount(count - 1) }}>-</button>
        <span>{count}</span>
        <button onClick={() => { setCount(count + 1) }}>+</button>
      </div>
    </div>
  )
}

export default Count
