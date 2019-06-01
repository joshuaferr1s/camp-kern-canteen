import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import Store from './store';

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

// Listeners //

db.collection('campers').onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === 'added') {
      const {
        name, cabin, amount, purchases,
      } = change.doc.data();
      Store.commit('addCamper', {
        id: change.doc.id, name, cabin, amount, purchases,
      });
    } else if (change.type === 'modified') {
      const {
        name, cabin, amount, purchases,
      } = change.doc.data();
      Store.commit('updateCamper', {
        id: change.doc.id, name, cabin, amount, purchases,
      });
    } else if (change.type === 'removed') {
      const {
        name, cabin, amount, purchases,
      } = change.doc.data();
      Store.commit('deleteCamper', {
        id: change.doc.id, name, cabin, amount, purchases,
      });
    }
  });
});

db.collection('cabins').onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === 'added') {
      const {
        cabin,
      } = change.doc.data();
      Store.commit('addCabin', {
        id: change.doc.id, cabin,
      });
    } else if (change.type === 'modified') {
      const {
        cabin,
      } = change.doc.data();
      Store.commit('updateCabin', {
        id: change.doc.id, cabin,
      });
    } else if (change.type === 'removed') {
      const {
        cabin,
      } = change.doc.data();
      Store.commit('deleteCabin', {
        id: change.doc.id, cabin,
      });
    }
  });
});

// End of Listeners //

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
    await db.collection('campers').add({ ...payload, products: [] });
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

Firebase.deleteCampers = async () => {
  try {
    const batch = db.batch();
    const docs = await db.collection('campers').get();
    docs.docs.map(val => batch.delete(val.ref));
    await batch.commit();
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
