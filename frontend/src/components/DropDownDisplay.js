import React from 'react'

class DropDownDisplay extends React.Component {
  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(e) {
    this.props.selectDestination(e)
  }

  render() {
    const dropDownDisplay = this.props.dropDownDisplay
    return(
      <div>
        <div className="container">
          <div className="box" onClick={this.handleClick}>
            {dropDownDisplay}
          </div>
        </div>
      </div>
    )
  }
}


export default DropDownDisplay

// const DropDownDisplay = ({dropDownDisplay}) => {
  //   return(
    //     <div>
    //       <div className="container">
    //         <div className="box" onClick=>
    //           {dropDownDisplay}
    //         </div>
    //       </div>
    //     </div>
    //   )
    // }
