import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class BottomDestinationDisplay extends React.Component {
  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(e) {
    this.props.onHandleDirectionsButtonClick()
  }

  render() {
    const placeNameStrArray = this.props.destinationData.place_name.split(',')
    const placeName = placeNameStrArray[0]
    const placeAddress = placeNameStrArray[1]+', '+placeNameStrArray[2]
    return(
      <div className="bottomFormContainer">
        <div className="box is-radiusless">
          <div className="content">
            <h4>{placeName}</h4>
            <p>{placeAddress}</p>
            <button className="button is-info" onClick={this.handleClick} >
              <span className="icon">
                <FontAwesomeIcon icon="directions"/>
              </span>
              <span>Directions</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

}
