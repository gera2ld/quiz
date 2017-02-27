<template>
  <div class="card flex-auto mb-3">
    <div class="card-header">
      Quiz detail [{{quiz.id || 'NEW'}}]
    </div>
    <div class="card-block scroll-y">
      <div class="form-group">
        <label>Title</label>
        <input class="form-control" v-model="quiz.title">
      </div>
      <div class="form-group">
        <label>Languages</label>
        <div class="mb-2">
          <div class="badge badge-info mr-2" v-for="lang in selectedLangs" :key="lang">
            <span v-text="lang.data.title"></span>
            <i class="fa fa-times ml-1" @click="onToggleLang(lang)"></i>
          </div>
        </div>
        <search-input :items="langs" @pick="onToggleLang" />
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea class="form-control detail-desc" v-model="quiz.description" />
      </div>
    </div>
    <div class="card-footer">
      <button class="btn btn-primary" @click="onOK">OK</button>
      <button class="btn btn-default" @click="onCancel">Cancel</button>
    </div>
  </div>
</template>

<script>
import store from 'src/services/store';
import SearchInput from 'src/components/search-input';
import {loadItem, updateItem} from './utils';
import {loadList as loadLanguageList} from '../language/utils';

export default {
  components: {
    SearchInput,
  },
  data() {
    return {
      store,
      quiz: {},
      langs: [],
    };
  },
  computed: {
    quizData() {
      return this.store.quiz.current.data || {};
    },
    selectedLangs() {
      return this.langs.filter(item => item.active);
    },
  },
  watch: {
    quizData(data) {
      this.quiz = {
        id: data.id,
        title: data.title,
        description: data.description,
      };
      this.checkLangs();
    },
  },
  created() {
    loadLanguageList().then(this.resetLangs);
    const {id} = this.$route.params;
    if (!this.quiz.id && id !== '_new') loadItem(id, true);
  },
  destroyed() {
    store.quiz.current.data = null;
  },
  methods: {
    checkLangs() {
      const map = (this.quizData.languages || []).reduce((map, item) => {
        map[item.id] = true;
        return map;
      }, {});
      this.langs.forEach(item => {
        item.active = map[item.data.id];
      });
    },
    resetLangs() {
      this.langs = this.store.lang.list.data.map(item => ({
        data: item,
        title: item.title,
        active: false,
        search: `${item.title}\n${item.value}`.toLowerCase(),
      }));
      this.checkLangs();
    },
    onToggleLang(lang) {
      lang.active = !lang.active;
    },
    onOK() {
      const data = {
        ...this.quiz,
        languages: this.selectedLangs.map(item => item.data.id),
      };
      updateItem(data).then(this.onCancel);
    },
    onCancel() {
      this.$router.push('/quiz');
    },
  },
};
</script>
