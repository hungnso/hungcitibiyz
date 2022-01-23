import React from 'react'

import { Navigate, Outlet } from 'react-router-dom'

function PrivatePage() {
  const user = localStorage.getItem('uid')

  const isMember = !!user
  console.log(!isMember)

  return !!isMember ? <Outlet /> : <Navigate to="/login" />
}

export default PrivatePage
