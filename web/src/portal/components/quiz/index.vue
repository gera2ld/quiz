<template>
  <div class="flex-auto row pb-3">
    <div class="col-6" v-for="quiz in store.list.data">
      <router-link class="card" :to="`/quiz/${quiz.id}`">
        <div class="card-block">
          <h4 v-text="quiz.title"></h4>
          <div class="badge badge-info mr-2" v-for="lang in quiz.languages" v-text="lang.title"></div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import store from 'src/services/store';
import {loadList} from './utils';

export default {
  data() {
    return {
      store: store.quiz,
    };
  },
  created() {
    loadList();
  },
};
</script>

<style lang="scss" scoped>
.card {
  transition: border-color .3s;
  &:hover {
    border-color: #3D8EB9;
  }
}
</style>
