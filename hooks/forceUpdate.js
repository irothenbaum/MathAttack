import React, {useState} from 'react'

function forceUpdate() {
  const [renderControl, setRenderControl] = useState(false)

  return {
    reRender: () => setRenderControl(!renderControl),
  }
}

export default forceUpdate
