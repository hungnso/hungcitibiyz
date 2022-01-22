import React, { useState } from 'react'
import Mapbox from './mapbox'
import HomeSidebar from './homeSidebar'
import './homeSidebar.css'
import LogOut from '../components/LogOut'
function Home() {
  const [currRoom, setCurrRoom] = useState()
  console.log(currRoom)
  return (
    <div className="homeView">
      <LogOut />
      <div className="sidebar">
        <HomeSidebar setCurrRoom={setCurrRoom} />
      </div>
      <div className="maps">
        <Mapbox member={currRoom} />
      </div>
    </div>
  )
}

export default Home
