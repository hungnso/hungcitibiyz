import React, { useContext, useEffect, useCallback } from 'react'
import { StaticMap, Marker } from 'react-map-gl'
import { useState } from 'react'
import { AppContext } from '../Context/AppProvider'
import { AuthContext } from '../Context/AuthProvider'
import axios from 'axios'
import DeckGL from '@deck.gl/react'
import 'mapbox-gl/dist/mapbox-gl.css'
import { GeoJsonLayer } from '@deck.gl/layers'
import './homeSidebar.css'
import { FaMapMarkerAlt } from 'react-icons/fa'

function Mapbox({ focusLocation }) {
  const [viewport, setViewport] = useState({
    width: '75vw',
    height: '100vh',
    latitude: 21.0164909,
    longitude: 105.7772149,
    zoom: 16
  })

  const token = 'pk.eyJ1IjoidHJhbm5oYW4xMiIsImEiOiJja3k5cnd6M2QwOWN4MnZxbWJianJvNTgxIn0.ubgU2PdV-ahm1liOZLyjMw'
  const [newAddress, setNewAddress] = useState([])
  const [newMember, setNewMember] = useState([])
  const [userCoord, setUserCoord] = useState('')
  const [focusLocationCoord, setFocusLocationCoord] = useState('')
  const { list, Member } = useContext(AppContext)
  const {
    user: { uid }
  } = React.useContext(AuthContext)

  useEffect(() => {
    let newS = []
    list.map(address => {
      axios
        .get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${address.location}.json?access_token=${token}`)
        .then(function (response) {
          newS.push({
            ...address,
            longitude: response.data.features[0].center[0],
            latitude: response.data.features[0].center[1]
          })
        })
        .catch(function (error) {
          console.log(error)
        })
    })
    setNewAddress(newS)
  }, [list])

  useEffect(() => {
    let newS = []
    Member.map(address => {
      axios
        .get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${address.currentLocation}.json?access_token=${token}`)
        .then(function (response) {
          newS.push({
            ...address,
            longitude: response.data.features[0].center[0],
            latitude: response.data.features[0].center[1]
          })
        })
        .catch(function (error) {
          console.log(error)
        })
    })
    setNewMember(newS)
  }, [Member])

  // Convert location from name to coordinates
  const convertLocationName = useCallback(nameLocation => {
    axios
      .get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${nameLocation}.json?access_token=${token}`)
      .then(function (response) {
        const newCoordFocusLocation = `105.79845,20.99345;${response.data.features[0].center[0]},${response.data.features[0].center[1]}`
        setFocusLocationCoord(newCoordFocusLocation)
      })
      .catch(function (error) {
        console.log(error)
      })
  }, [])

  // Display route from user to entertainment venues
  useEffect(() => {
    if (!focusLocation) return
    setFocusLocationCoord('')
    convertLocationName(focusLocation)
  }, [convertLocationName, focusLocation])

  async function getMatchingGeometry() {
    if (!focusLocationCoord) return
    // Create the query
    const query = await fetch(
      `https://api.mapbox.com/matching/v5/mapbox/driving/${focusLocationCoord}?&radiuses=25;25&geometries=geojson&steps=true&access_token=${token}`,
      { method: 'GET' }
    )
    const response = await query.json()
    // Handle errors
    if (response.code !== 'Ok') {
      console.log(`${response.code} - ${response.message}`)
      return
    }
    // Get the coordinates from the response
    const coords = response.matchings[0].geometry
    return coords
    // Code from the next step will go here
  }

  const layerRoute = new GeoJsonLayer({
    id: 'geojson-layer',
    data: getMatchingGeometry(),
    pickable: true,
    stroked: false,
    filled: true,
    extruded: true,
    pointType: 'circle',
    lineWidthMinPixels: 2,
    lineWidthMaxPixels: 20,
    getFillColor: [160, 160, 180, 200],
    getLineColor: [70, 23, 143, 255],
    getPointRadius: 100
  })

  return (
    <div className="vote_mapbox">
      <DeckGL
        initialViewState={{
          longitude: viewport.longitude,
          latitude: viewport.latitude,
          zoom: viewport.zoom
        }}
        height={viewport.height}
        width={viewport.width}
        controller={true} // allows the user to move the map around
        layers={layerRoute} // layers here!
      >
        <StaticMap
          // ref={mapRef}
          // {...viewport}
          {...viewport}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxApiAccessToken={token}
          onViewportChange={setViewport}
        >
          {newAddress.map(val => {
            return (
              <Marker latitude={val.latitude} longitude={val.longitude} offsetLeft={-10} offsetTop={-28}>
                <div>
                  <FaMapMarkerAlt className="marker marker_location" />
                </div>
              </Marker>
            )
          })}
          {newMember.map(val => {
            return (
              <Marker latitude={val.latitude} longitude={val.longitude} offsetLeft={-10} offsetTop={-28}>
                <div>
                  <FaMapMarkerAlt className="marker marker_user" />
                </div>
              </Marker>
            )
          })}
        </StaticMap>
      </DeckGL>
    </div>
  )
}
export default Mapbox
