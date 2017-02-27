import Vue from 'vue';
import store from 'src/services/store';
import {User} from 'src/services/restful';

const user = store.user = {
  list: {
    data: [],
  },
  current: {
    data: null,
  },
};

export function loadList() {
  return User.get().then(data => {
    user.list.data = data;
  });
}

export function loadItem(id, allowCache) {
  return new Promise((resolve, reject) => {
    if (!allowCache) return reject();
    const data = user.list.data.find(item => item.id === id);
    data ? resolve(data) : reject();
  })
  .catch(() => User.get(id).then(data => {
    updateStore(id, data);
    return data;
  }))
  .then(data => {
    user.current.data = data;
  });
}

export function updateItem(data) {
  return User.patch(data.id, data)
  .then(data => updateStore(data.id, data));
}

function updateStore(id, data) {
  const i = user.list.data.findIndex(item => item.id === id);
  ~i && Vue.set(user.list.data, i, data);
}
