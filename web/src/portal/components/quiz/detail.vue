<template>
  <div class="card flex-auto mb-3">
    <div class="card-header">
      <ul class="nav nav-tabs card-header-tabs">
        <li class="nav-item">
          <router-link class="nav-link"
          :class="{active: $route.name === 'description'}"
          :to="`/quiz/${$route.params.id}`">
            Description
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link"
          :class="{active: $route.name === 'submission'}"
          :to="`/quiz/${$route.params.id}/submission`">
            Submission
          </router-link>
        </li>
      </ul>
    </div>
    <router-view class="card-block scroll-y" />
  </div>
</template>

<script>
import Vue from 'vue';
import showdown from 'showdown';
import store from 'src/services/store';
import {loadItem} from './utils';

const converter = new showdown.Converter();

export default {
  data() {
    return {
      store: store.quiz,
    };
  },
  computed: {
    quiz() {
      return this.store.current.data || {};
    },
  },
  watch: {
    quiz: 'parse',
  },
  created() {
    loadItem(this.$route.params.id, true);
    this.parse();
  },
  methods: {
    parse() {
      Vue.set(this.store.current, 'description', converter.makeHtml(this.quiz.description || ''));
    },
  },
};
</script>
