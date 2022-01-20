import React from 'react'
import { useHistory, useNavigate } from 'react-router-dom'
import { Container, Row, Col } from 'reactstrap'
import firebase, { auth } from '../firebase/config'
import { addDocument } from '../firebase/services'

const fbProvider = new firebase.auth.FacebookAuthProvider()
const googleProvider = new firebase.auth.GoogleAuthProvider()

function LoginSocial({ setIsAuth }) {
  const navigate = useNavigate()
  const isUser = localStorage.getItem('isAuth')
  console.log(isUser)
  if (isUser) {
    navigate('/home')
  }

  const handleLogin = async provider => {
    const { additionalUserInfo, user } = await auth.signInWithPopup(provider)
    if (additionalUserInfo?.isNewUser && user) {
      localStorage.setItem('isAuth', true)
      setIsAuth(true)
      addDocument('users', {
        displayName: user.displayName,
        email: user.email,
        uid:user.uid,
        photoURL: user.photoURL,
        providerId: additionalUserInfo.providerId
      })
      navigate('/home')
    }
  }
  return (
    <div className="login_form">
      <div className="krqetT"></div>
      <div className="ifKAln"></div>
      <Container>
        <h1
          style={{
            color: 'white',
            textTransform: 'uppercase',
            textAlign: 'center'
          }}
        >
          Chào mừng bạn đến với App Cùng Đi Chơi
        </h1>
        <Row>
          <Col md={3}></Col>
          <Col md={6}>
            <div className="login_wrapper">
              <Row className="form_row">
                <Col>
                  <button onClick={() => handleLogin(fbProvider)} className="facebook">
                    <img
                      src={'https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png'}
                      className="icon_social"
                    />
                    <span>Đăng Nhập Facebook</span>
                  </button>
                </Col>
                <Col>
                  <button onClick={() => handleLogin(googleProvider)} className="google">
                    <img
                      src={
                        'https://www.socialflow.com/wp-content/uploads/2019/01/8ca486faebd822ddf4baf00321b16df1-google-icon-logo-by-vexels.png'
                      }
                      className="icon_social"
                    />
                    Đăng Nhập Google
                  </button>
                </Col>
              </Row>
            </div>
          </Col>
          <Col md={3}></Col>
        </Row>
      </Container>
    </div>
  )
}

export default LoginSocial
