<template>
  <div class="flex-auto mb-3 d-flex flex-column">
    <div class="mb-3">
      <router-link class="btn btn-primary" to="/quiz/_new">Add a quiz</router-link>
      <div class="d-inline-block">
        <input class="form-control" placeholder="Search quiz..." v-model="search">
      </div>
    </div>
    <div class="cards flex-auto row align-content-start scroll-y">
      <div class="col-12" v-if="!quizzes.length">
        <div class="jumbotron">
          <p>No quiz is found!</p>
          <p>
            <router-link class="btn btn-primary" to="/quiz/_new">Add a quiz</router-link>
          </p>
        </div>
      </div>
      <div class="col-6 mb-3" v-for="quiz in quizzes" :key="quiz">
        <quiz-item :quiz="quiz" @remove="onRemove" />
      </div>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import store from 'src/services/store';
import QuizItem from './item';
import {loadList, removeItem} from './utils';

export default {
  components: {
    QuizItem,
  },
  data() {
    return {
      search: '',
      store: store,
    };
  },
  computed: {
    quizzes() {
      return this.store.quiz.list.data;
    },
  },
  watch: {
    search(search) {
      this.debouncedLoadData();
    },
  },
  created() {
    this.debouncedLoadData = debounce(this.loadData, 300);
    this.loadData();
  },
  methods: {
    loadData() {
      const q = this.search;
      loadList({q});
    },
    onEdit(quiz) {
      this.quiz = {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
      };
      const map = quiz.languages.reduce((map, lang) => {
        map[lang.id] = this.langs.map[lang.id];
        return map;
      }, {});
      this.langs.data.forEach(lang => {
        lang.active = !!map[lang.id];
      });
    },
    onRemove(quiz) {
      removeItem(quiz.id);
    },
  },
};
</script>

<style>
.detail-desc {
  height: 20em;
}
</style>
