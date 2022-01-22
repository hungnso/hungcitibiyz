import React from 'react'

import { Navigate, Outlet } from 'react-router-dom'
import { AuthContext } from '../../Context/AuthProvider'

function PrivatePage() {
  const user = localStorage.getItem('uid')
  console.log(user)
  const isMember = !!user
  console.log(!isMember)

  return !!isMember ? <Outlet /> : <Navigate to="/login" />
}

export default PrivatePage
