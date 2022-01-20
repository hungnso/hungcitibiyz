import React, { useRef, useContext } from 'react'
import './styles.css'
import { useOutsideClick } from './useOutsideClick'
import { AuthContext } from '../Context/AuthProvider'
import firebase from '../firebase/config'

function LogOut() {
  const dropdownRef = useRef(null)
  const [isActive, setIsActive] = useOutsideClick(dropdownRef, false)
  const onClick = () => setIsActive(!isActive)

  const {
    user: { displayName, uid, photoURL }
  } = useContext(AuthContext)

  const signOutUser = () => firebase.auth.signOut()

  return (
    <div className="menu-container">
      <button onClick={onClick} className="menu-trigger">
        <span>{displayName}</span>
        <img src={photoURL} alt="User avatar" />
      </button>
      <nav ref={dropdownRef} className={`menu ${isActive ? 'active' : 'inactive'}`}>
        <ul>
          <li>
            <button onClick={signOutUser}>Đăng Xuất</button>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default LogOut
