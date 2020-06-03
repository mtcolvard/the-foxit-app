import * as React from 'react'
import {PureComponent} from 'react'
import {Marker} from 'react-map-gl'

const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`

const SIZE = 20

// const parkObject = Object.entries(data)
// console.log(parkObject)


// Important for perf: the markers never change, avoid rerender when the map viewport changes
export default class Pins extends PureComponent {
  render() {
    const {data, onClick} = this.props
    console.log(data)

    return data.map((park, index) => (
      <Marker key={`marker-${index}`} longitude={park[0]} latitude={park[1]}>
        <svg
          height={SIZE}
          viewBox="0 0 24 24"
          style={{
            cursor: 'pointer',
            fill: '#d00',
            stroke: 'none',
            transform: `translate(${-SIZE / 2}px,${-SIZE}px)`
          }}
        >
          <path d={ICON} />
        </svg>
      </Marker>
    ))
  }
}
// this goes right after }} after transfor
// onClick={() => onClick(city)}





// import React from 'react'
//
// const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
//   c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
//   C20.1,15.8,20.2,15.8,20.2,15.7z`
//
// const pinStyle = {
//   cursor: 'pointer',
//   fill: 'red',
//   stroke: 'black',
//   strokeWidth: '1px'
// }
//
// const Pin = props => (
//   <svg
//     height={20}
//     viewBox="0 0 24 24"
//     style={{
//       // ...pinStyle,
//       transform: `translate(${-20 / 2}px,${-20}px)`
//     }}
//     onClick={props.onClick}
//   >
//     <path d={ICON} />
//   </svg>
// )
//
// export default Pin
