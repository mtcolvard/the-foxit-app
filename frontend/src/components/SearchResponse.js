import React from 'react'
import Map from './Map'
import DropDownDisplay from './DropDownDisplay'

class SearchResponse extends React.Component {
  constructor() {
    super()
    this.passthrough = this.passthrough.bind(this)
  }

  passthrough(e) {
    this.props.selectDestination(e)
  }

  render() {
    const searchResponseData = this.props.searchResponseData
    let indexNumber = 0
    return(
      <div>
        {searchResponseData.features.map(element =>
          <div key={element.id}>
            <DropDownDisplay
              dropDownDisplayName={element.place_name}
              searchResponseData={searchResponseData}
              selectDestination={this.passthrough}
              index={indexNumber++}
            />
          </div>
        )}
      </div>
    )
  }
}


export default SearchResponse

// const SearchResponse = ({searchResponseData}) => {
//   console.log('features length', searchResponseData.features.length)
//   return(
//     <div>
//       {searchResponseData.features.map(element =>
//         <div key={element.id}>
//           <DropDownDisplay
//             dropDownDisplay={element.place_name}
//             selectDestination={this.props.sendDestinations}
//           />
//         </div>
//       )}
//     </div>
//   )
// }
