import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import { Container, Row, Col, Button } from 'reactstrap'
import InputForm from '../components/InputForm'
import { AuthContext } from '../Context/AuthProvider'
import { auth, db } from '../firebase/config'
import { addDocument } from '../firebase/services'
import Mapbox from '../MapAddAddress/mapbox'
import ModalForm from '../components/ModalForm'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { AppContext } from '../Context/AppProvider'

export default function LoginForm() {
  let navigate = useNavigate()
  const { curraddName } = useContext(AppContext)
  const [nickname, setNickName] = React.useState('')
  const { roomClient } = useContext(AppContext)

  // React.useEffect(() => {
  //   db.collection('users').onSnapshot(snapshot => {
  //     const data = snapshot.docs.map(doc => ({
  //       ...doc.data(),
  //       id: doc.id
  //     }))
  //     console.log({ data, snapshot, docs: snapshot.docs })
  //   })
  // }, [])

  const [show, setShow] = useState(false)

  const handleCLick = e => {
    e.preventDefault()
    // navigate('/create')
  }

  const handleGoBack = () => {
    navigate(-1)
  }
  const {
    user: { displayName, uid }
  } = useContext(AuthContext)

  const onClose = () => {
    setShow(false)
  }
  const formik = useFormik({
    initialValues: {
      full_name: nickname
    },
    validationSchema: Yup.object({
      full_name: Yup.string()
        .min(2, 'Tên Phải Chứa Ít Nhất 2 Ký Tự')
        .max(30, 'Tên Chứa Tối Đa 30 Ký Tự')
        .required('Tên Không Được Để Trống!')
    }),
    onSubmit: values => {
      console.log(values)
      setNickName(values.full_name)
      console.log(curraddName)
      addDocument('user_room', {
        currentLocation: curraddName,
        nickname: values.full_name,
        user_id: uid
      })
      navigate('/create')
    }
  })

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
          Chào mừng {displayName} đến với App Cùng Đi Chơi
        </h1>
        <Row>
          <Col lg={3}></Col>
          <Col lg={6}>
            <form onSubmit={formik.handleSubmit}>
              <div className="login_wrapper">
                <div className="formsix-pos">
                  <div className="form-group">
                    <InputForm
                      type="text"
                      id="Text1"
                      placeholder={formik.values.full_name ? formik.values.full_name : 'Tên Người Dùng *'}
                      name="full_name"
                      defaultValue={formik.values.full_name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.errors.full_name && formik.touched.full_name && (
                      <p className="msg_err">{formik.errors.full_name}</p>
                    )}
                  </div>
                </div>
                <div className="formsix-e">
                  <div className="form-group">
                    <div className="address_vote">
                      <div className="">{curraddName}</div>
                      <div
                        className="btn_address"
                        onClick={e => {
                          e.preventDefault()
                          setShow(true)
                        }}
                      >
                        {curraddName ? 'Sửa địa chỉ' : 'Nhập địa chỉ của bạn'}
                      </div>
                      <ModalForm
                        show={show}
                        onHide={() => setShow(false)}
                        ModalTile={''}
                        ModalChildren={<Mapbox onClose={onClose} />}
                        size="xl"
                      />
                    </div>
                  </div>
                </div>

                <div className="login_btn_wrapper">
                  <button type="submit" onClick={e => handleGoBack(e)} className="btn login_btn">
                    Trở Về
                  </button>
                  <button type="submit" disabled={!(formik.values.full_name && curraddName)} className="btn login_btn">
                    Tiếp Theo
                  </button>
                </div>
              </div>
            </form>
          </Col>
          <Col lg={3}></Col>
        </Row>
      </Container>
    </div>
  )
}
