import React, { useContext, useState, useEffect } from 'react'
import { Container, Row, Col } from 'reactstrap'
import Carousel from 'react-bootstrap/Carousel'
import { useNavigate } from 'react-router-dom'
import InputForm from '../components/InputForm'
import './styles.css'
import { AppContext } from '../Context/AppProvider'
import { db } from '../firebase/config'
import { AuthContext } from '../Context/AuthProvider'
import useCurrAdd from '../hooks/useCurrAdd'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import LogOut from '../components/LogOut'
import { FaVoteYea } from 'react-icons/fa'
import { AiFillDelete } from 'react-icons/ai'

function Home() {
  const {
    user: { uid, displayName }
  } = useContext(AuthContext)
  const {
    roomClient,
    roomHost,
    setSelectedRoomId,
    selectedRoomHost,
    selectedRoomClient,
    setCurrLocation,
    setCurrAddName
  } = useContext(AppContext)
  const [hasFocus, setFocus] = useState(false)

  const navigate = useNavigate()
  const handleCLick = e => {
    e.preventDefault()
    setCurrLocation('')

    setCurrAddName('')
    navigate('/contact')
  }

  db.collection('rooms')
    .orderBy('createdAt')
    .where('user_id', '==', '4qh5ZZkhSFVCJm2hInWNuKgNUcA3')
    .onSnapshot(snapshot => {
      const documents = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }))
    })

  const conditionHost = React.useMemo(() => {
    return {
      fieldName: 'room_id',
      operator: '==',
      compareValue: selectedRoomHost.id
    }
  }, [selectedRoomHost.id])
  const conditonUser = React.useMemo(() => {
    return {
      fieldName: 'user_id',
      operator: '==',
      compareValue: uid
    }
  }, [uid])

  const conditionClient = React.useMemo(() => {
    return {
      fieldName: 'room_id',
      operator: '==',
      compareValue: selectedRoomClient.id
    }
  }, [selectedRoomClient.id])

  const currAddHost = useCurrAdd('user_room', conditionHost, conditonUser)
  const currAddClient = useCurrAdd('user_room', conditionClient, conditonUser)

  // React.useEffect(() => {
  //   // console.log(currAddHost)
  // }, [currAddHost])
  // React.useEffect(() => {
  //   console.log(currAddClient)
  // }, [currAddClient])

  const handleJoinRoom = value => {
    setSelectedRoomId(value)
    // localStorage.setItem('roomId', value)
    navigate(`/room-vote/${value}`)
  }
  const formik = useFormik({
    initialValues: {
      content: ''
    },
    validationSchema: Yup.object({
      content: Yup.string()
        .min(2, 'N???i Dung Ph???i Ch???a ??t Nh???t 2 K?? T???')
        .max(30, 'N???i Dung T???i ??a 512 K?? T???')
        .required('N???i Dung Kh??ng ???????c ????? Tr???ng!')
    }),
    onSubmit: values => {
      const clickRoom = db.collection('rooms').doc(values.content)
      // alert(JSON.stringify(values, null, 2))
      clickRoom.get().then(doc => {
        if (doc.exists) {
          const { member, client } = doc.data()
          if (!member.includes(uid)) {
            clickRoom.update({
              member: [...member, uid],
              client: [...client, uid]
            })
          } else {
            alert('B???n ???? v??o ph??ng n??y r???i vui l??ng ki???m tra trong m???c ph??ng ???? tham gia!')
            return
          }

          setSelectedRoomId(values.content)

          navigate(`/contact`)
        } else {
          // doc.data() will be undefined in this case
          alert('Ph??ng n??y kh??ng t???n t???i')
        }
      })
    }
  })

  const handleFocus = () => {
    if (formik.values.content) {
      setFocus(true)
    } else {
      setFocus(false)
    }
  }

  const handleDelete = id => {
    console.log('Xo?? btn')
  }

  // tabs
  const [currentTab, setCurrentTab] = useState('tab1')
  const tabList = [
    {
      name: 'tab1',
      label: 'Chung',
      content: (
        <div className="tab-content">
          <h1 className="home_title">Ch???n l???a n??i ??i ch??i th???t nhanh ch??ng v?? ti???n l???i.</h1>
          <div className="span_title">
            <div>C?? qu?? nhi???u l???a ch???n? C??c b???n ??ang tranh c??i ????? t??m ra ?????a ??i???m vui ch??i l?? t?????ng?</div>
            Vi???c th???ng nh???t ?????a ??i???m cho nh???ng cu???c vui gi??? ????y kh??ng c??n l?? v???n ?????. Cungdichoi cung c???p n???n t???ng ????? t???
            ch???c c??c cu???c b???u ch???n th???t d??? d??ng.
          </div>
          <div className="home_left">
            <div className="home_item">
              <button onClick={e => handleCLick(e)} className="btn_add">
                <span>
                  <FaVoteYea /> Cu???c B??nh Ch???n M???i
                </span>
              </button>
              <form onSubmit={formik.handleSubmit}>
                <InputForm
                  type="text"
                  id="Text1"
                  placeholder=" Nh???p m?? ph??ng t???i ????y"
                  name="content"
                  defaultValue={formik.values.content}
                  onChange={formik.handleChange}
                  onFocus={() => setFocus(true)}
                  onBlur={handleFocus}
                />
                {hasFocus ? (
                  <button type="submit" className="btn_tg" disabled={!(formik.isValid && formik.dirty)}>
                    Tham Gia
                  </button>
                ) : null}
              </form>
            </div>
          </div>
        </div>
      )
    },
    {
      name: 'tab2',
      label: 'B??nh Ch???n C???a B???n',
      content: (
        <div className="tab-content">
          <h2>C??c Ph??ng B???n ???? T???o B??nh Ch???n</h2>
          {roomHost.map(room => (
            <div className="list_room" key={room.id}>
              <button className="btn_address" onClick={() => handleJoinRoom(room.id)}>
                {room.title}
              </button>
              <button className="login_btn btn_delete" onClick={handleDelete}>
                <AiFillDelete />
              </button>
            </div>
          ))}
        </div>
      )
    },
    {
      name: 'tab3',
      label: 'B??nh Ch???n Tham Gia',
      content: (
        <div className="tab-content">
          <h2>C??c Ph??ng B???n ???? Tham Gia</h2>
          {roomClient.map(room => (
            <div className="list_room" key={room.id}>
              <button className="btn_address" onClick={() => handleJoinRoom(room.id)}>
                {room.title}
              </button>
              <button className="login_btn btn_delete" onClick={handleDelete}>
                <AiFillDelete />
              </button>
            </div>
          ))}
        </div>
      )
    }
  ]
  return (
    <div className="home_body">
      <LogOut />
      <Container>
        <Row>
          <Col lg={6}>
            <div className="tabs">
              {tabList.map((tab, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentTab(tab.name)}
                  className={tab.name === currentTab ? 'tabs_active' : 'btn_tabs'}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {tabList.map((tab, i) => {
              if (tab.name === currentTab) {
                return <div key={i}>{tab.content}</div>
              } else {
                return null
              }
            })}
          </Col>
          <Col lg={6}>
            <Carousel>
              <Carousel.Item>
                <img
                  className="d-block img_slide"
                  src="https://www.gstatic.com/meet/user_edu_get_a_link_light_90698cd7b4ca04d3005c962a3756c42d.svg"
                  alt="First slide"
                />
                <Carousel.Caption>
                  <h3>Nh???n ???????ng li??n k???t b???n c?? th??? chia s???</h3>
                  <p>
                    Nh???p v??o <strong>Cu???c b??nh ch???n m???i</strong> ????? nh???n ???????ng li??n k???t m?? b???n c?? th??? g???i cho nh???ng
                    ng?????i m??nh mu???n h???p c??ng
                  </p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block img_slide"
                  src="https://www.gstatic.com/meet/user_edu_brady_bunch_light_81fa864771e5c1dd6c75abe020c61345.svg"
                  alt="Second slide"
                />

                <Carousel.Caption>
                  <h3>Xem m???i ng?????i c??ng l??c</h3>
                  <p>
                    ????? th???y nhi???u ng?????i h??n c??ng m???t l??c, h??y chuy???n t???i ph???n Thay ?????i b??? c???c trong tr??nh ????n T??y ch???n
                    kh??c.
                  </p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block img_slide"
                  src="https://www.gstatic.com/meet/user_edu_scheduling_light_b352efa017e4f8f1ffda43e847820322.svg"
                  alt="Third slide"
                />

                <Carousel.Caption>
                  <h3>L??n k??? ho???ch tr?????c</h3>
                  <p>
                    Nh???p v??o <strong>Cu???c b??nh ch???n m???i</strong> ????? l??n l???ch cu???c b??nh ch???n trong L???ch Google v?? g???i l???i
                    m???i cho ng?????i tham gia
                  </p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block img_slide"
                  src="https://www.gstatic.com/meet/user_edu_safety_light_e04a2bbb449524ef7e49ea36d5f25b65.svg"
                  alt="Four slide"
                />

                <Carousel.Caption>
                  <h3>Cu???c h???p c???a b???n ???????c b???o v??? an to??n</h3>
                  <p>Kh??ng ai c?? th??? tham gia cu???c h???p tr??? khi ng?????i t??? ch???c m???i ho???c cho ph??p</p>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Home
