import React from 'react'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'
import { useState } from 'react'

function Mapbox(member) {
  const [viewport, setViewport] = useState({
    width: '75vw',
    height: '100vh',
    latitude: 21.0164909,
    longitude: 105.7772149,
    zoom: 16
  })

  console.log(member);
  const showClient = () => {
    alert('hello world')
  }
  return (
    <div className="mapBox">
      <ReactMapGL
        {...viewport}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        onViewportChange={nextViewport => setViewport(nextViewport)}
        mapboxApiAccessToken="pk.eyJ1IjoibmFtNzU3NzAwIiwiYSI6ImNreTlydXF0dzA3YXgycG1nNHBubzI0MmQifQ.s7lXBzeWikKP9HhgoUwsqA"
      >
        <Marker latitude={21.0169247} longitude={105.7811318} offsetLeft={0} offsetRight={0}>
          <div>
            <img
              style={{ width: '30px', height: '40px' }}
              src="https://www.pinclipart.com/picdir/middle/525-5258227_google-map-marker-icon-png-clipart.png"
            />
            map
          </div>
        </Marker>
        <Marker latitude={21} longitude={105.7811318} offsetLeft={0} offsetRight={0}>
          <div>
            <img
              style={{ width: '30px', height: '40px' }}
              src="https://www.pinclipart.com/picdir/middle/525-5258227_google-map-marker-icon-png-clipart.png"
            />
            map
          </div>
        </Marker>
      </ReactMapGL>
      <div className="listClient" onClick={showClient}>
          {/* {member.map(client => {
            <div className="client" key={client.uid}></div>
          })} */}
      </div>
    </div>
  )
}
export default Mapbox
