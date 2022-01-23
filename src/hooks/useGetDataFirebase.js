import React, { useState } from 'react'
import { db } from '../firebase/config'

const useGetDataFirebase = (collection, condition) => {
  const [documents, setDocuments] = useState([])

  React.useEffect(() => {
    let collectionRef = db.collection(collection)
    if (condition) {
      if (!condition.compareValue || !condition.compareValue.length) {
        // reset documents data
        setDocuments([])
        return
      }

      collectionRef = collectionRef.where(condition.fieldName, condition.operator, condition.compareValue)
    }

    const unsubscribe = collectionRef.get().then(querySnapshot => {
      const documents = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }))
      setDocuments(documents)
    })

    return unsubscribe
  }, [collection, condition])

  return documents
}

export default useGetDataFirebase
