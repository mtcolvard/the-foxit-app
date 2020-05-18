import React from 'react'

class DropDownDisplay extends React.Component {
  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(e) {
    this.props.selectDestination(this.props.searchResponseData.features[this.props.index])
    console.log('handleClick', this.props.index)
  }

  render() {
    const dropDownDisplayName = this.props.dropDownDisplayName
    return(
      <div>
        <div className="container">
          <div className="box"  onClick={this.handleClick}>
            {dropDownDisplayName}
          </div>
        </div>
      </div>
    )
  }
}

export default DropDownDisplay
