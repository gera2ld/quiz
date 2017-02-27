<template>
  <div class="flex-auto mb-3 row align-content-start scroll-y">
    <lang-item v-for="item in langs" :key="item"
      class="col-4 col-md-3 mb-3" :lang="item" :state="states[item.id]"
      @edit="onEdit" @submit="onSubmit" @cancel="onCancel"
    />
    <lang-item
      class="col-4 col-md-3 mb-3" v-if="lang"
      :lang="lang" :state="states['']"
      @submit="onSubmit" @cancel="onCancel"
    />
    <div class="col-4 col-md-3 mb-3">
      <button class="btn btn-default" v-show="!lang" @click="onCreate">
        <i class="fa fa-plus"></i>
      </button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import store from 'src/services/store';
import LangItem from './item';
import {loadList, updateItem} from './utils';

export default {
  components: {
    LangItem,
  },
  data() {
    return {
      store: store.lang,
      states: {},
      lang: null,
    };
  },
  computed: {
    langs() {
      return this.store.list.data;
    },
  },
  created() {
    loadList();
  },
  methods: {
    setState(id, state) {
      id = id || '';
      Vue.set(this.states, id, {
        ...this.states[id],
        ...state,
      });
    },
    onCreate() {
      this.lang = {title: '', value: ''};
      this.onEdit(this.lang);
    },
    onEdit(lang) {
      this.setState(lang.id, {editing: true});
    },
    onSubmit(lang) {
      updateItem(lang).then(() => this.onCancel(lang));
    },
    onCancel(lang) {
      this.setState(lang.id, {editing: false});
      if (!lang.id) this.lang = null;
    },
  },
};
</script>
