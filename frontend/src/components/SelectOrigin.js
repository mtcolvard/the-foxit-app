import React from 'react'
import {Link} from 'react-router-dom'

const SelectOrigin = (props) => {
  return (
    <div className="box">
      <div className="field">
        <div className="control">
          <input  className="input"
            type="text"
            placeholder="Choose destination"
            value=''
          />
        </div>
        <div className="control">
          <input  className="input"
            type="text"
            placeholder="Choose destination"
            value=''
          />
        </div>
        <div className="control">
          <input  className="input"
            type="text"
            placeholder="Choose destination"
            value=''
          />
        </div>
        <div className="control">
          <Link to="/">
          <button className="button">
            clickme
          </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SelectOrigin
