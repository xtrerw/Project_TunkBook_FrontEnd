import React from 'react'
import "./NotFound.css"
const NotFound = (msg) => {
  return (
    <div className='not-found'>
      {msg && msg.message ? (
        <h1>{msg.message}</h1>
      ) : (
        <h1>Page Not Found</h1>
      )}
    </div>
  )
}

export default NotFound
