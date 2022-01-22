import { useCallback } from 'react'
import firebase, { db } from './config'

export const addDocument = (collection, data) => {
  const query = db.collection(collection)
  // db.collection.add('room', {})

  query.add({
    ...data,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  })
}
