import React, { useState } from 'react'
import Mapbox from './mapbox'
import HomeSidebar from './homeSidebar'
import './homeSidebar.css'
import LogOut from '../components/LogOut'
import { useParams } from 'react-router-dom'
function Home() {
  const [currRoom, setCurrRoom] = useState()
  const [focusLocation, setFocusLocation] = useState()
  const params = useParams()
  return (
    <div className="homeView">
      <LogOut />
      <div className="sidebar">
        <HomeSidebar setCurrRoom={setCurrRoom} setFocusLocation={setFocusLocation} />
      </div>
      <div className="maps">
        <Mapbox currRoom={currRoom} params={params.id} focusLocation={focusLocation} />
      </div>
    </div>
  )
}

export default Home
