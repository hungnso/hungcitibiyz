import React from 'react'
import Mapbox from './mapbox'
import HomeSidebar from './homeSidebar'
import './homeSidebar.css'
import LogOut from '../components/LogOut'
import { useState } from 'react'

function Home() {
  
  // const [client, setClient] = useState([])

  return (
    <div className="homeView">
      <LogOut />
      <div className="sidebar">
        <HomeSidebar />
      </div>
      <div className="maps">
        <Mapbox />
      </div>
    </div>
  )
}

export default Home
