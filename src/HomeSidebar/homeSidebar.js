import React, { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import './homeSidebar.css'
import { useNavigate, useParams } from 'react-router-dom'
import ModalForm from '../components/ModalForm'
import PopupForm from '../components/PopupForm'
import { AppContext } from '../Context/AppProvider'
import useFirestore from '../hooks/useFirestore'
import { addDocument } from '../firebase/services'
import { AuthContext } from '../Context/AuthProvider'
import { db } from '../firebase/config'
import MapboxLocationVote from '../MapAddAddress/mapboxLocationVote'
import { query, orderBy, where,limit } from "firebase/firestore";  


const HomeSidebar = ({ setCurrRoom }) => {
  const navigate = useNavigate()
  const { selectedRoomHost, selectedRoomClient, locationVote, setLocationVote, selectedRoomId, setList } =
    React.useContext(AppContext)
  const params = useParams()
  const {
    user: { uid }
  } = React.useContext(AuthContext)

  const [show, setShow] = useState(false)

  const [show2, setShow2] = useState(false)
  const [listAdd, setListAdd] = useState([])

  const [valueRoom, setValueRoom] = useState({})
  const onClose = () => {
    setShow2(false)
  }
  const conditionVote = React.useMemo(() => {
    return {
      fieldName: 'room_id',
      operator: '==',
      compareValue: params.id
    }
  }, [params.id])

 

  // const conditionHostVote = React.useMemo(() => {
  //   return {
  //     fieldName: 'room_id',
  //     operator: '==',
  //     compareValue: selectedRoomHost.id
  //   }
  // }, [selectedRoomHost.id])
  // const conditionClientVote = React.useMemo(() => {
  //   return {
  //     fieldName: 'room_id',
  //     operator: '==',
  //     compareValue: selectedRoomClient.id
  //   }
  // }, [selectedRoomClient.id])
  React.useEffect(() => {
    const { id } = params
    db.collection('rooms')
      .doc(id)
      .get()
      .then(doc => {
        if (doc.exists) {
          setValueRoom(doc.data())
        } else {
          // doc.data() will be undefined in this case
          alert('Phòng này không tồn tại')
        }
      })
  }, [params])

  React.useEffect(() => {
    locationVote.map(value => {
      addDocument('locations', {
        location: value,
        num_vote: 0,
        vote_users: [],
        room_id: params.id,
        createBy: uid
      })
      setLocationVote([])
    })
  }, [locationVote, params.id, uid, setLocationVote])

  // useEffect(() => {
  //   listAdd.map(location => {
  //     let locationId = location.id
  //     let locationItem = db.collection('locations').doc(locationId)
  //     locationItem
  //       .get()
  //       .then(doc => {
  //         let voteUsers = doc.data().vote_users
  //         voteUsers.include
  //       })
  //       .catch(error => {
  //         console.log('Error getting document:', error)
  //       })
  //   })
  // }, [])


  



  





  const arrLocationVoteHost = useFirestore('locations', conditionVote)
 
  React.useMemo(() => {
    let listLocationVote = [...arrLocationVoteHost]
    setList(listLocationVote)
    setListAdd(listLocationVote)
  }, [arrLocationVoteHost, setList])

  React.useMemo(() => {
    let listLocationVote = [...arrLocationVoteHost]
    setList(listLocationVote)
    setListAdd(listLocationVote)
  }, [arrLocationVoteHost, setList])

  const handleGoBack = () => {
    navigate(-1)
  }



  const dulieu =db.collection("locations")
  const Abc =() =>{
    dulieu.where('room_id' ,'==',selectedRoomId).orderBy('num_vote','desc').limit(1).get().then((querySnapshot) => {
       querySnapshot.forEach((doc) => {
           console.log(doc.data())
           
       });
     });
     // console.log(listAdd.orderBy("num_vote","decs"))
     
     // console.log(laydulieu)

     console.log(selectedRoomId)
   }
  /// Lấy ra danh sách người dùng có trong phòng
  // console.log(valueRoom)
  const usersCondition = React.useMemo(() => {
    return {
      fieldName: 'uid',
      operator: 'in',
      compareValue: valueRoom.member
    }
  }, [valueRoom.member])

  const memberList = useFirestore('users', usersCondition)
  // console.log(memberList)

  setCurrRoom(valueRoom)
  const handleEndVote = e => {
    e.preventDefault()
    if (!selectedRoomHost.title) {
      alert('Chỉ người tạo phòng mới đc end')
      Abc()
    } else {
      
      Abc()
      // navigate('/announcingVote')
      
      
    }
  }

  const handleCheckBox = e => {
    const locationId = e.target.value
    // Create a reference to the locationId doc.
    const locationItem = db.collection('locations').doc(locationId)
    locationItem
      .get()
      .then(doc => {
        console.log('Document data:', doc.data().vote_users)
      })
      .catch(error => {
        console.log('Error getting document:', error)
      })

    return db
      .runTransaction(transaction => {
        // This code may get re-run multiple times if there are conflicts.
        return transaction.get(locationItem).then(sfDoc => {
          if (!sfDoc.exists) {
            // eslint-disable-next-line no-throw-literal
            throw 'Document does not exist!'
          }
          let numVote = sfDoc.data().num_vote
          // let voteUsers = sfDoc.data().vote_users
          if (e.target.checked) {
            console.log(true)
            transaction.update(locationItem, { num_vote: numVote + 1 })
            // transaction.update(locationItem, { vote_users: voteUsers.push(uid) })
          } else {
            console.log(false)
            transaction.update(locationItem, { num_vote: numVote - 1 })
            // let newVoteUsers = voteUsers.splice(voteUsers.indexOf('c'), 1)
            // transaction.update(locationItem, { vote_users: newVoteUsers })
          }
        })
      })
      .then(() => { })
      .catch(error => {
        console.log('Transaction failed: ', error)
      })
  }
  return (
    <>
      <div className="home">
        <div className="home-sidebar">
          <div className="home-sidebar-title">
            {/* <h2>{selectedRoomHost.title ? selectedRoomHost.title : selectedRoomClient.title}</h2> */}
            <h2>{valueRoom.title}</h2>
          </div>
          <div className="home-sidebar-content">
            {/* <h2>{selectedRoomHost.description ? selectedRoomHost.description : selectedRoomClient.description}</h2> */}
            <h2>{valueRoom.description}</h2>
          </div>

          <div className="home-sidebar-members">
            {listAdd.map(location => (
              <div className="vote" key={location.id}>
                <h4 className="nameVote">
                  <input
                    type="checkbox"
                    value={location.id}
                    onChange={e => handleCheckBox(e)}
                  // checked={location => (location.vote_users.includes(uid) ? true : false)}
                  ></input>
                  {location.location}
                </h4>
                <h5 className="quantilyVote">{location.num_vote}</h5>
              </div>
            ))}
          </div>
          {/* <div className="home-sidebar-location">
                      
                  </div> */}

          <div className="btnLocation_share">
            <button style={{ width: '95%' }} onClick={() => setShow2(true)}>
              Thêm địa Chỉ
            </button>
            <ModalForm
              show={show2}
              onHide={() => setShow2(false)}
              ModalTile={''}
              ModalChildren={<MapboxLocationVote onClose={onClose} />}
              size="xl"
            />
          </div>
          <div className="btnLocation_share">
            <button style={{ width: '95%' }} onClick={() => setShow(true)}>
              Chia Sẻ Link
            </button>
            <ModalForm
              show={show}
              onHide={() => setShow(false)}
              ModalTile={''}
              ModalChildren={<PopupForm value={`http://localhost:3000/${selectedRoomId}`} />}
              size="md"
            />
          </div>
          <div className="btnEndVote">
            <button type="submit" onClick={e => handleEndVote(e)}>
              END VOTE
            </button>
          </div>
          <button className="go-back" onClick={handleGoBack}>
            <span>Quay lại</span>
          </button>
        </div>
      </div>
    </>
  )
}

export default HomeSidebar
