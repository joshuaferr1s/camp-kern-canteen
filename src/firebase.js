import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
  apiKey: 'AIzaSyA2oXAA3-n_sFg2gfLhxbuTSasZALPRj58',
  authDomain: 'kern-canteen.firebaseapp.com',
  databaseURL: 'https://kern-canteen.firebaseio.com',
  projectId: 'kern-canteen',
  storageBucket: 'kern-canteen.appspot.com',
  messagingSenderId: '1076453578484',
  appId: '1:1076453578484:web:cd7f5ad66b39f98a',
};

const Firebase = firebase.initializeApp(config);
const db = firebase.firestore();

// Campers //
Firebase.getCampers = async () => {
  try {
    const querySnapshot = await db.collection('campers').get();
    const campers = querySnapshot.docs.map((doc) => {
      const {
        name, cabin, amount, purchases,
      } = doc.data();
      return {
        id: doc.id, name, cabin, amount, purchases,
      };
    });
    return campers;
  } catch (err) {
    return err;
  }
};

Firebase.addCamper = async (payload) => {
  try {
    await db.collection('campers').add(payload);
    return true;
  } catch (err) {
    return err;
  }
};

Firebase.editCamper = async (payload) => {
  try {
    await db.collection('campers').doc(payload.id).update({ ...payload.data });
    return true;
  } catch (err) {
    return err;
  }
};

Firebase.deleteCamper = async (payload) => {
  try {
    await db.collection('campers').doc(payload).delete();
    return true;
  } catch (err) {
    return err;
  }
};

// Cabins
Firebase.getCabins = async () => {
  try {
    const querySnapshot = await db.collection('cabins').get();
    const cabins = querySnapshot.docs.map((doc) => {
      const { cabin } = doc.data();
      return {
        id: doc.id, cabin,
      };
    });
    return cabins;
  } catch (err) {
    return err;
  }
};

Firebase.addCabin = async (payload) => {
  try {
    await db.collection('cabins').add(payload);
    return true;
  } catch (err) {
    return err;
  }
};

Firebase.editCabin = async (payload) => {
  try {
    await db.collection('cabins').doc(payload.id).update({ ...payload.data });
    return true;
  } catch (err) {
    return err;
  }
};

Firebase.deleteCabin = async (payload) => {
  try {
    await db.collection('cabins').doc(payload).delete();
    return true;
  } catch (err) {
    return err;
  }
};

// Products

export default Firebase;
