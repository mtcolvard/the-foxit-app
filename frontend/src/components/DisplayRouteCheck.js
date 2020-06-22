import React from 'react'

class DisplayRouteCheck extends React.PureComponent{
  constructor(){
    super()
  }
  componentDidMount() {
    this.props.sendDestinationToBackend(this.props.originLonLat, this.props.destinationLonLat)
    console.log('componentDidMount')
  }
  componentDidUpdate() {
    this.props.sendDestinationToBackend(this.props.originLonLat, this.props.destinationLonLat)
    console.log('componentDidUpdate')
  }

  render() {
    return(<div></div>)
  }
}

export default DisplayRouteCheck
