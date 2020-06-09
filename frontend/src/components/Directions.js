import React from 'react'

class Directions extends React.Component {
  constructor() {
    super()
  }
  render() {
    return (
      <div className="container is-vcentered">
        <div className="columns is-mobile">
          <div className="column">
          Icon
          </div>
          <div className="column is-three-fifths">
            <div className="field">
              <div className="control">
                <input readOnly className="input"
                  type="text"
                  value="Your Location"
                />
                <input readOnly className="input"
                  type="text"
                  value="Choose destination"
                />
              </div>
            </div>
          </div>
          <div className="column">
          Icon
          </div>
        </div>
      </div>
    )
  }
}

export default Directions
