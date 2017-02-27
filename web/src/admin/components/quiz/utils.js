import Vue from 'vue';
import store from 'src/services/store';
import {Quiz} from 'src/services/restful';

const quiz = store.quiz = {
  list: {
    data: [],
  },
  current: {
    data: null,
  },
};

export function loadList(params) {
  return Quiz.get(null, params).then(data => {
    quiz.list.data = data;
  });
}

export function loadItem(id, allowCache) {
  return new Promise((resolve, reject) => {
    if (!allowCache) return reject();
    const data = quiz.list.data.find(item => item.id === id);
    data ? resolve(data) : reject();
  })
  .catch(() => Quiz.get(id).then(data => {
    updateStore(id, data);
    return data;
  }))
  .then(data => {
    quiz.current.data = data;
  });
}

export function updateItem(data) {
  return (data.id ? Quiz.put(data.id, data) : Quiz.post(null, data))
  .then(data => {
    updateStore(data.id, data, true);
  });
}

export function removeItem(id) {
  return Quiz.delete(id).then(() => {
    updateStore(id);
  });
}

function updateStore(id, data, addNew) {
  const i = quiz.list.data.findIndex(item => item.id === id);
  if (~i) {
    if (data) {
      Vue.set(quiz.list.data, i, data);
    } else {
      quiz.list.data.splice(i, 1);
    }
  } else if (addNew) {
    quiz.list.data.push(data);
  }
}
