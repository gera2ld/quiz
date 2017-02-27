import Vue from 'vue';
import store from 'src/services/store';
import {Language} from 'src/services/restful';

const lang = store.lang = {
  list: {
    data: [],
  },
};

export function loadList() {
  return Language.get().then(data => {
    lang.list.data = data;
  });
}

export function updateItem(data) {
  return (data.id ? Language.put(data.id, data) : Language.post(null, data))
  .then(data => {
    updateStore(data.id, data, true);
  });
}

function updateStore(id, data, addNew) {
  const i = lang.list.data.findIndex(item => item.id === id);
  if (~i) {
    if (data) {
      Vue.set(lang.list.data, i, data);
    } else {
      lang.list.data.splice(i, 1);
    }
  } else if (addNew) {
    lang.list.data.push(data);
  }
}
