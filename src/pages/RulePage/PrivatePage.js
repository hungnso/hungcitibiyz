import React from 'react'

import { Navigate, Outlet } from 'react-router-dom'
import { AuthContext } from '../../Context/AuthProvider'

function PrivatePage() {
  const user = React.useContext(AuthContext)
  const isMember = !!user

  return isMember ? <Outlet /> : <Navigate to="/login" />
}

export default PrivatePage
