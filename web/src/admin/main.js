import Vue from 'vue';
import App from './app';
import router from './router';
import store from 'src/services/store';
import {Me, User} from 'src/services/restful';
import 'src/components/dropdown';
import 'src/style.scss';

function loadMe() {
  return Me.get()
  .then(data => {
    store.me = data;
    store.me.permissions = data.permissions.reduce((res, key) => {
      res[key] = true;
      return res;
    }, {});
  })
  .catch(err => {
    if (err.status === 401) {
      // Not logged in
      // console.log('/account/login');
      location.replace('/account/login');
    } else if (err.status === 404) {
      // Invalid user
      // console.log('/account/logout');
      location.replace('/account/logout');
    } else if (err.status === 403) {
      store.me = {};
      router.replace('forbidden');
      return;
    }
    throw err;
  });
}

User.Quiz = User.model(':id', 'quizzes');

loadMe().then(() => new Vue({
  el: '#app',
  router,
  render: h => h(App)
}));
