import React, { useState } from 'react'
import Mapbox from './mapbox'
import HomeSidebar from './homeSidebar'
import './homeSidebar.css'
import LogOut from '../components/LogOut'
import { useParams } from 'react-router-dom'
function Home() {
  const [currRoom, setCurrRoom] = useState()
  const params = useParams()
  return (
    <div className="homeView">
      <LogOut />
      <div className="sidebar">
        <HomeSidebar setCurrRoom={setCurrRoom} />
      </div>
      <div className="maps">
        <Mapbox currRoom={currRoom} params={params.id} />
      </div>
    </div>
  )
}

export default Home
