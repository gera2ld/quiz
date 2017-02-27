import Vue from 'vue';
import Router from 'vue-router';
import Home from 'portal/components/home';
import Forbidden from 'src/components/forbidden';
import store from 'src/services/store';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/forbidden',
      name: 'forbidden',
      component: Forbidden,
    },
    {
      path: '/',
      name: 'home',
      component: Home,
    }
  ]
});

router.beforeEach((to, from, next) => {
  const {permissions} = store.me;
  if (permissions && permissions.admin) {
    if (to.name === 'forbidden') next('home');
    else next();
  } else {
    if (to.name === 'forbidden') next();
    else next('forbidden');
  }
});

export default router;
