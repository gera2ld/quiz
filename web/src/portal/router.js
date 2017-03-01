import Vue from 'vue';
import Router from 'vue-router';
import Quiz from 'portal/components/quiz';
import QuizDetail from 'portal/components/quiz/detail';
import QuizDescription from 'portal/components/quiz/description';
import QuizSubmission from 'portal/components/quiz/submission';
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
      name: 'quiz',
      component: Quiz,
    },
    {
      path: '/quiz/:id',
      component: QuizDetail,
      children: [
        {
          path: '',
          name: 'description',
          component: QuizDescription,
        },
        {
          path: 'submission',
          name: 'submission',
          component: QuizSubmission,
        },
      ],
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
