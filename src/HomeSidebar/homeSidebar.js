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
  const {
    selectedRoomHost,
    locationVote,
    setLocationVote,
    selectedRoomId,
    setSelectedRoomId,
    setList,
    setCurrLocation,
    setNickname
  } = React.useContext(AppContext)
  // console.log(selectedRoomHost)
  const params = useParams()
  const {
    user: { uid }
  } = React.useContext(AuthContext)
  // console.log(uid)

  const [show, setShow] = useState(false)

  const [show2, setShow2] = useState(false)

  const [listAdd, setListAdd] = useState([])

  const [valueRoom, setValueRoom] = useState({})

  const [voteWin, setVoteWin] = useState('')

  const [isActive, setActive] = useState(false)

  const [voteStatus, setvoteStatus] = useState(true)

  const room =db.collection("rooms")
  const onClose = () => {
    setShow2(false)
  }

  /// Lấy ra danh sách địa điểm vote
  const conditionVote = React.useMemo(() => {
    return {
      fieldName: 'room_id',
      operator: '==',
      compareValue: params.id
    }
  }, [params.id])
  //// Kiểm tra host để end Vote
  const conditionEndVote = React.useMemo(() => {
    return {
      fieldName: 'user_id',
      operator: '==',
      compareValue: uid
    }
  }, [uid])
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

  const listRoomHost = useFirestore('rooms', conditionEndVote)
  const isHost = listRoomHost.find(value => value.id === params.id)


 


  React.useEffect(()=>{
    room.doc(params.id).get().then((doc)=> {
      console.log(doc.data().vote_status)
      setActive(!doc.data().vote_status)
    }); 
    getDataVote()

   
  },[setActive])



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
    navigate('/')
  }



  const dataVoteWin =db.collection("locations")
  const getDataVote =() =>{
    
    dataVoteWin.where('room_id' ,'==',params.id).orderBy('num_vote','desc').limit(1).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // console.log(doc.data())
            setVoteWin(doc.data())
            
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
      fieldName: 'room_id',
      operator: '==',
      compareValue: params.id
    }
  }, [params.id])

  const listMember = useFirestore('user_room', usersCondition)
  const memberList = listMember.slice(1)
  console.log(memberList)
  // console.log(memberList.filter((v, i) => memberList.indexOf(v.avatar) === i))
  // console.log(memberList.filter((v, i) => memberList.indexOf(v.avatar) === i))

  setCurrRoom(valueRoom)
  // const handleEndVote = e => {
  //   e.preventDefault()
  //   if (!selectedRoomHost.title) {
  //     Abc()
  //   } else {
      
  //     Abc()
  //     // navigate('/announcingVote')
      
      
  //   }
  // }

  
  
  
  const handleEndVote = e => {
      e.preventDefault()
      getDataVote()
      
      setActive(true)

      db.collection("rooms").doc(params.id).update({
        "vote_status": false
      })
      .then(() => {
          console.log("Document successfully updated!");
      }) 
     
    }

    const handleConfim = e => {
      if(window.confirm("Bạn có muốn kết thúc bình chọn")){
        handleEndVote(e)
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
      .then(() => {})
      .catch(error => {
        console.log('Transaction failed: ', error)
      })
  }
  console.log(isActive)
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
        



          <div className={isActive ? "home-sidebar-content" : "contendisable"}>
            <h4>Địa điểm được chọn nhiều nhất</h4>
            <hr/>
            <h5>{voteWin.location}</h5>
          </div>





          <div className="home-sidebar-location">
            {listAdd.map(location => (
              <div className="vote" key={location.id}>
                <span className="nameVote">
                  <input
                    type="checkbox"
                    value={location.id}
                    onChange={e => handleCheckBox(e)}
                    // checked={location => (location.vote_users.includes(uid) ? true : false)}
                  ></input>
                  {location.location}
                </span>
                <h5 className="quantilyVote">{location.num_vote}</h5>
              </div>
            ))}
          </div>
          <div className="home-sidebar-member">
            {memberList?.map(member => (
              <div className="vote" key={member.uid}>
                <img src={member.avatar}></img>
                <span className="nameVote">
                  {member.nickname}
                </span>
              </div>
            ))}
          </div>

          

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

          <div className="btnShareLink">
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
            {isHost?.title ? (
              <button type="submit" disabled={isActive} onClick={handleConfim}>
                Kết thúc
              </button>
            ) : (
              ''
            )}
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
