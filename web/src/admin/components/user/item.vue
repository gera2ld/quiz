<template>
  <div>
    <div class="float-right">
      <a href="#" v-if="quiz.users.length" @click.prevent="onRemove">
        <i class="fa fa-trash"></i>
      </a>
      <a href="#" v-else @click.prevent="onAdd">
        <i class="fa fa-plus"></i>
      </a>
    </div>
    <h4 v-text="quiz.title"></h4>
    <div v-for="lang in quiz.languages"
    class="badge badge-info mr-2"
    v-text="lang.title"></div>
  </div>
</template>

<script>
export default {
  props: ['quiz'],
  methods: {
    onAdd() {
      this.$emit('add', this.quiz);
    },
    onRemove() {
      this.$emit('remove', this.quiz);
    },
  },
};
</script>
