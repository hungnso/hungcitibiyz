import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { AuthContext } from '../../Context/AuthProvider'

function GuestPage() {
  const user = React.useContext(AuthContext)
  console.log(user)
  const isMember = !!user
  return !isMember ? <Outlet /> : <Navigate to="/home" />
}
export default GuestPage
