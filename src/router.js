import Vue from 'vue';
import Router from 'vue-router';
import store from './store';
import Campers from './views/Campers.vue';
import Cabins from './views/Cabins.vue';
import SignIn from './views/SignIn.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'signIn',
      component: SignIn,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/campers',
      name: 'campers',
      component: Campers,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/cabins',
      name: 'cabins',
      component: Cabins,
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const { signedIn } = store.state;
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!signedIn) {
      return next({ path: '/' });
    }
    return next();
  }
  if (signedIn) {
    return next({ path: '/campers' });
  }
  return next();
});

export default router;
