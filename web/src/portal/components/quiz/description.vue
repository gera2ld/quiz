<template>
  <div>
    <h2 v-text="quiz.title"></h2>
    <div class="mb-3">
      <div class="badge badge-info mr-2" v-for="lang in quiz.languages" v-text="lang.title"></div>
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
    <button class="btn btn-primary" @click="onSubmit">Submit</button>
  </div>
</template>

<script>
import showdown from 'showdown';
import store from 'src/services/store';
import {Me} from 'src/services/restful';
import VueCode from 'src/components/vue-code';

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
    quiz: 'update',
    'code.language'(language) {
      this.options = {
        ...this.options,
        mode: language && language.value,
      };
    },
  },
  created() {
    this.update();
  },
  methods: {
    update() {
      const languages = this.quiz.languages || [];
      this.code.language = languages[0];
    },
    onSubmit() {
      const data = {
        code: this.code.value,
        languageId: this.code.language.id,
      };
      const {id} = this.$route.params;
      Me.Quiz.model(id).post('solutions', data)
      .then(solution => {
        this.$router.push(`/quiz/${id}/submission`);
      });
    },
  },
};
</script>
