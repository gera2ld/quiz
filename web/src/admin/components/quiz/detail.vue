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
        <div class="float-right">
          Preview
          <a href="#" @click.prevent="onTogglePreview">
            <i class="fa cursor-pointer" :class="`fa-toggle-${quiz.preview ? 'on' : 'off'}`"></i>
          </a>
        </div>
        <label>
          Description
          (<a href="https://en.wikipedia.org/wiki/Markdown" target="_blank">Markdown</a>)
        </label>
        <div class="form-control-container">
          <vue-code class="h-100" v-model="quiz.description" :options="descOptions" v-show="!quiz.preview" />
          <div class="form-control-preview h-100" v-html="quiz.descriptionHTML" v-show="quiz.preview"></div>
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
import showdown from 'showdown';
import store from 'src/services/store';
import SearchInput from 'src/components/search-input';
import VueCode from 'src/components/vue-code';
import {loadItem, updateItem} from './utils';
import {loadList as loadLanguageList} from '../language/utils';

const descOptions = {
  mode: 'markdown',
  lineWrapping: true,
};

const converter = new showdown.Converter();

export default {
  components: {
    VueCode,
    SearchInput,
  },
  data() {
    return {
      store,
      descOptions,
      quiz: {
        title: '',
        description: '',
        preview: false,
      },
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
        ...data,
        preview: false,
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
    onTogglePreview() {
      if (this.quiz.preview = !this.quiz.preview) {
        this.quiz.descriptionHTML = converter.makeHtml(this.quiz.description);
      }
    },
    onOK() {
      const {id, title, description} = this.quiz;
      const data = {
        id, title, description,
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

<style lang="scss">
.form-control-container {
  height: 30em;
  .CodeMirror {
    height: 100%;
  }
}
.form-control-preview {
  padding: .5em 1em;
  border: 1px solid #eee;
  overflow: auto;
}
</style>
