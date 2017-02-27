import Vue from 'vue';
import Router from 'vue-router';
import Quiz from 'admin/components/quiz';
import QuizDetail from 'admin/components/quiz/detail';
import User from 'admin/components/user';
import UserDetail from 'admin/components/user/detail';
import Language from 'admin/components/language';
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
      redirect: '/quiz',
    },
    {
      path: '/user',
      name: 'user',
      component: User,
      meta: {
        group: 'user',
      },
    },
    {
      path: '/user/:id',
      name: 'user.detail',
      component: UserDetail,
      meta: {
        group: 'user',
      },
    },
    {
      path: '/quiz',
      name: 'quiz',
      component: Quiz,
      meta: {
        group: 'quiz',
      },
    },
    {
      path: '/quiz/:id',
      name: 'quiz.detail',
      component: QuizDetail,
      meta: {
        group: 'quiz',
      },
    },
    {
      path: '/lang',
      name: 'lang',
      component: Language,
      meta: {
        group: 'lang',
      },
    },
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
