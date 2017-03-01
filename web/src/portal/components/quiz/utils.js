import Vue from 'vue';
import store from 'src/services/store';
import {Me} from 'src/services/restful';

const quiz = store.quiz = {
  list: {
    data: [],
  },
  current: {
    data: null,
  },
};

export function loadList() {
  return Me.Quiz.get().then(data => {
    quiz.list.data = data;
  });
}

export function loadItem(id, allowCache) {
  return new Promise((resolve, reject) => {
    if (!allowCache) return reject();
    const data = quiz.list.data.find(item => item.id === id);
    data ? resolve(data) : reject();
  })
  .catch(() => Me.Quiz.get(id))
  .then(data => {
    quiz.current.data = data;
  });
}
