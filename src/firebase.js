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
      if (!change.doc.metadata.fromCache) {
        const {
          name, cabin, amount, purchases, method, sessions,
        } = change.doc.data();
        Store.commit('addCamper', {
          id: change.doc.id, name, cabin, amount, purchases, method, sessions,
        });
      }
    } else if (change.type === 'modified') {
      const {
        name, cabin, amount, purchases, method, sessions,
      } = change.doc.data();
      Store.commit('updateCamper', {
        id: change.doc.id, name, cabin, amount, purchases, method, sessions,
      });
    } else if (change.type === 'removed') {
      const {
        name, cabin, amount, purchases, method, sessions,
      } = change.doc.data();
      Store.commit('deleteCamper', {
        id: change.doc.id, name, cabin, amount, purchases, method, sessions,
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

db.collection('products').onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === 'added') {
      const {
        product, price,
      } = change.doc.data();
      Store.commit('addProduct', {
        id: change.doc.id, product, price,
      });
    } else if (change.type === 'modified') {
      const {
        product, price,
      } = change.doc.data();
      Store.commit('updateProduct', {
        id: change.doc.id, product, price,
      });
    } else if (change.type === 'removed') {
      const {
        name, cabin, amount, purchases,
      } = change.doc.data();
      Store.commit('deleteProduct', {
        id: change.doc.id, name, cabin, amount, purchases,
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
        name, cabin, amount, purchases, method, sessions,
      } = doc.data();
      return {
        id: doc.id, name, cabin, amount, purchases, method, sessions,
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
Firebase.getProducts = async () => {
  try {
    const querySnapshot = await db.collection('products').get();
    const products = querySnapshot.docs.map((doc) => {
      const {
        product, price,
      } = doc.data();
      return {
        id: doc.id, product, price,
      };
    });
    return products;
  } catch (err) {
    return err;
  }
};

Firebase.addProduct = async (payload) => {
  try {
    await db.collection('products').add({ ...payload });
    return true;
  } catch (err) {
    return err;
  }
};

Firebase.editProduct = async (payload) => {
  try {
    await db.collection('products').doc(payload.id).update({ ...payload.data });
    return true;
  } catch (err) {
    return err;
  }
};

Firebase.deleteProduct = async (payload) => {
  try {
    await db.collection('products').doc(payload).delete();
    return true;
  } catch (err) {
    return err;
  }
};

Firebase.deleteProducts = async () => {
  try {
    const batch = db.batch();
    const docs = await db.collection('products').get();
    docs.docs.map(val => batch.delete(val.ref));
    await batch.commit();
    return true;
  } catch (err) {
    return err;
  }
};

export default Firebase;
