import React, {useState, useEffect, useMemo} from 'react'
import axios from 'axios'


function HookDropDownDisplay(props) {
  const [originLonLat, setOriginLonLat] = useState(null)
  const [destinationLonLat, setDestinationLonLat] = useState(null)
  const [searchCount, setSearchCount] = useState()
  const displayBox = props.isSearchTriggered
  const dropDownDisplayName = props.dropDownDisplayName

  const {onSendDestinationToBackend, selectDestination} = props

  useEffect(()=> {
    if(originLonLat && destinationLonLat) {
      onSendDestinationToBackend(originLonLat, destinationLonLat)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originLonLat, destinationLonLat])



  // const routeResponseData = useMemo(()=> onSendDestinationToBackend(originLonLat, destinationLonLat), [originLonLat, destinationLonLat])
  console.log('originLonLat', originLonLat)
  console.log('destinationLonLat', destinationLonLat)

  function setLonLat() {
    if(props.originOrDestinationSearch === 'origin') {
      setOriginLonLat(props.searchResponseData.features[props.index].center)
    } else if(props.originOrDestinationSearch === 'destination'){
      setDestinationLonLat(props.searchResponseData.features[props.index].center)
    }
  }

  // <div>
  //   <div className="container">
  //     <div className={ displayBox ? 'box' : ''} onClick={
  //       ()=> setLonLat(),
  //       ()=> props.selectDestination(props.searchResponseData.features[props.index])}>
  //       {dropDownDisplayName}
  //     </div>
  //   </div>
  // </div>

  // function sendSelectDestination() {
  //   props.selectDestination(props.searchResponseData.features[props.index])
  // }

  return(
    <div>
      <div className="container">
        <div className={ displayBox ? 'box' : ''} onClick={() =>
          setLonLat()}>
          {dropDownDisplayName}
        </div>
      </div>
    </div>
  )
}

export default HookDropDownDisplay
