<template>
  <div class="card flex-auto mb-3">
    <div class="card-header" v-text="`User detail [${user.id}]`"></div>
    <div class="card-block row">
      <div class="col-6 scroll-y">
        <div class="form-group">
          <div class="avatar align-middle"><img :src="user.avatar"></div>
          <strong class="align-middle ml-2" v-text="user.name || '[no name]'"></strong>
          <span class="ml-5">Login name: {{user.login}}</span>
        </div>
        <div class="form-group">
          <label>Permissions</label>
          <div class="mb-2">
            <div class="badge badge-info mr-2" v-for="perm in permissions.data" :key="perm">
              <span v-text="perm.title"></span>
              <i class="fa fa-times ml-1" @click="onRemovePerm(perm)"></i>
            </div>
          </div>
          <search-input :filtered="filteredPermissions"
          @pick="onAddPerm" @search="onSearchPerm" />
        </div>
      </div>
      <div class="col-6 d-flex flex-column">
        <h4>Quiz list</h4>
        <div class="form-group" v-dropdown="{click: false, focus: 'open'}">
          <input class="form-control" placeholder="Search quiz..." dropdown-toggle v-model="quizzes.search">
          <div class="dropdown-menu w-100" v-show="quizzes.searched.length">
            <quiz-item class="dropdown-item"
            v-for="quiz in quizzes.searched" :key="quiz"
            :quiz="quiz" @add="onAddQuiz" @remove="onRemoveQuiz" />
          </div>
        </div>
        <div class="flex-auto scroll-y">
          <p v-if="!quizzes.data.length">No quiz yet</p>
          <div class="card mb-2" v-for="quiz in quizzes.data" :key="quiz">
            <quiz-item class="card-block" :quiz="quiz" @remove="onRemoveQuiz" />
          </div>
        </div>
      </div>
    </div>
    <div class="card-footer">
      <button class="btn btn-primary" @click="onOK">OK</button>
      <button class="btn btn-default" @click="onCancel">Cancel</button>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import store from 'src/services/store';
import {User} from 'src/services/restful';
import SearchInput from 'src/components/search-input';
import {loadItem, updateItem} from './utils';
import QuizItem from './item';

const availablePermissions = [
  'admin',
];

export default {
  components: {
    SearchInput,
    QuizItem,
  },
  data() {
    return {
      store: store.user,
      permissions: {
        data: [],
        map: {},
        search: '',
      },
      quizzes: {
        search: '',
        data: [],
        searched: [],
      },
    };
  },
  computed: {
    user() {
      return this.store.current.data || {};
    },
    filteredPermissions() {
      const {permissions} = this;
      const {search} = permissions;
      let results;
      if (search) {
        results = [search];
        results = results.concat(availablePermissions.filter(v => (
          v !== search && v.includes(search)
        )));
      } else {
        results = availablePermissions;
      }
      return results.map(this.initPerm);
    },
  },
  watch: {
    user(user) {
      if (!user.id) return;
      const map = {};
      const data = [];
      user.permissions && user.permissions.forEach(value => {
        if (value && !map[value]) {
          map[value] = 1;
          data.push(this.initPerm(value));
        }
      });
      this.permissions = {
        map,
        data,
        search: '',
      };
    },
    'quizzes.search': debounce(function (search) {
      if (!search) {
        this.quizzes.searched = [];
        return;
      }
      const {id} = this.$route.params;
      User.Quiz.fill({id}).get(null, {q: search}).then(data => {
        this.quizzes.searched = data;
      });
    }, 300),
  },
  created() {
    const {id} = this.$route.params;
    if (!this.user.id) loadItem(id, true);
    User.Quiz.fill({id}).get().then(data => {
      this.quizzes.data = data;
    });
  },
  destroyed() {
    store.user.current.data = null;
  },
  methods: {
    initPerm(value) {
      return {
        title: value,
        search: value.toLowerCase(),
      };
    },
    onAddPerm(perm) {
      const {permissions} = this;
      if (!perm || permissions.map[perm.title]) return;
      permissions.map[perm.title] = 1;
      permissions.data.push(perm);
    },
    onRemovePerm(perm) {
      const {permissions} = this;
      if (!permissions.map[perm.title]) return;
      delete permissions.map[perm.title];
      const i = permissions.data.indexOf(perm);
      ~i && permissions.data.splice(i, 1);
    },
    onSearchPerm(text) {
      this.permissions.search = text;
    },
    onAddQuiz(quiz) {
      const {id} = this.$route.params;
      User.Quiz.fill({id}).put(quiz.id).then(() => {
        quiz.users = [{id}];
        const i = this.quizzes.data.findIndex(item => item.id === quiz.id);
        ~i || this.quizzes.data.push(quiz);
      });
    },
    onRemoveQuiz(quiz) {
      const {id} = this.$route.params;
      User.Quiz.fill({id}).delete(quiz.id).then(() => {
        quiz.users = [];
        const i = this.quizzes.data.findIndex(item => item.id === quiz.id);
        ~i && this.quizzes.data.splice(i, 1);
      });
    },
    onOK() {
      updateItem({
        id: this.$route.params.id,
        permissions: this.permissions.data,
      })
      .then(this.onCancel);
    },
    onCancel() {
      this.$router.push('/user');
    },
  }
};
</script>
