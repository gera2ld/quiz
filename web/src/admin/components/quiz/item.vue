<template>
  <div class="card">
    <div class="card-block">
      <div class="float-right">
        <router-link :to="`/quiz/${quiz.id}`">
          <i class="fa fa-edit"></i>
        </router-link>
        <a href="#" @click.prevent="onRemove">
          <i class="fa fa-trash"></i>
        </a>
      </div>
      <h4 v-text="quiz.title"></h4>
      <div v-for="lang in quiz.languages"
      class="badge badge-info mr-2"
      v-text="lang.title"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['quiz'],
  methods: {
    onRemove() {
      this.$emit('remove', this.quiz);
    },
  },
};
</script>
