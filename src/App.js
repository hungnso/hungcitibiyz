import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AuthProvider from './Context/AuthProvider'
import GroupForm from './GroupForm'
import LoginForm from './LoginForm'
import LoginSocial from './LoginSocial'
import HomeSidebar from './HomeSidebar'
import AnnouncingVote from './AnnouncingVote/announcingVote'
import Home from './home'
import LoadingLink from './LoadingLink'
import AppProvider from './Context/AppProvider'
import ListRoom from './ListRoom/ListRoom'
import GuestPage from './pages/RulePage/GuestPage'
import PrivatePage from './pages/RulePage/PrivatePage'
import ErrorPage from './pages/Loading/ErrorPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            <Route element={<GuestPage />}>
              <Route element={<LoginSocial />} path="login" />
            </Route>
            <Route element={<PrivatePage />}>
              <Route element={<LoginForm />} path="/contact" />
              <Route element={<GroupForm />} path="/create" />
              <Route element={<HomeSidebar />} path={'/room-vote/:id'} />
              <Route element={<AnnouncingVote />} path={'/announcingVote'} />
              <Route element={<Home />} path={'/'} />
              <Route element={<ListRoom />} path={'/list-room'} />
              <Route element={<LoadingLink />} path={'/:linkRoom'} />
              <Route element={<ErrorPage />} path={'/:error'} />
            </Route>
          </Routes>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
