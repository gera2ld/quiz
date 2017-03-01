<template>
  <div>
    <h2 v-text="quiz.title"></h2>
    <div class="mb-3">
      <div class="badge badge-info" v-for="lang in quiz.languages" v-text="lang.title"></div>
    </div>
    <div class="mb-3" v-html="description"></div>
    <div class="form-group row">
      <label class="col-2 col-form-label">Language</label>
      <div class="col-10">
        <select class="form-control" v-model="code.language">
          <option v-for="lang in quiz.languages" v-text="lang.title" :value="lang"></option>
        </select>
      </div>
    </div>
    <vue-code class="code-area mb-3" v-model="code.value" :options="options" />
    <button class="btn btn-primary">Submit</button>
  </div>
</template>

<script>
import VueCode from 'vue-code';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import showdown from 'showdown';
import store from 'src/services/store';

const converter = new showdown.Converter();

export default {
  components: {
    VueCode,
  },
  data() {
    return {
      store: store.quiz,
      code: {
        value: '',
        language: null,
      },
      options: {},
    };
  },
  computed: {
    quiz() {
      return this.store.current.data || {};
    },
    description() {
      return this.store.current.description;
    },
  },
  watch: {
    quiz() {
      const languages = this.quiz.languages || [];
      this.code.language = languages[0];
    },
    'code.language'(language) {
      this.options = Object.assign({}, this.options, {
        mode: language.value,
      });
    },
  },
};
</script>

<style lang="scss">
.code-area .CodeMirror {
  height: 30em;
}
</style>
