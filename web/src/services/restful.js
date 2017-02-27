import Restful from 'restful-fetch';

const restful = new Restful({
  root: '/api',
  config: {
    credentials: 'same-origin',
  },
});

restful.posthandlers.push(res => {
  if (res.data) {
    const meta = Object.keys(res).reduce((meta, key) => {
      if (key !== 'data') meta[key] = res[key];
      return meta;
    }, {});
    res.data.meta = meta;
    res = res.data;
  }
  return res;
});

export const Me = restful.model('me');
Me.Quiz = Me.model('quizzes');

export const User = restful.model('users');

export const Quiz = restful.model('quizzes');

export const Language = restful.model('languages');