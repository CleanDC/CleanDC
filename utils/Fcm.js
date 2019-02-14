import * as firebase from 'firebase/app'
import 'firebase/messaging'
firebase.initializeApp({ messagingSenderId: '737390945007' })

export default firebase.messaging()
