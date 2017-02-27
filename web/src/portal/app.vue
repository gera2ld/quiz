<template>
  <div id="app" class="d-flex flex-column container">
    <header class="mt-4 mb-3">
      <ul class="nav nav-tabs">
        <li class="hidden-xs-down">
          <span class="navbar-brand">Quiz</span>
        </li>
        <li class="nav-item">
          <router-link class="nav-link active" to="/">Home</router-link>
        </li>
        <li class="nav-item">
          <a class="nav-link" target="_blank" href="https://github.com/gera2ld/quiz/issues">Feedback</a>
        </li>
        <li class="user-corner ml-auto" v-if="me.id">
          <div class="avatar align-middle"><img :src="me.avatar"></div>
          <span class="ml-2 hidden-xs-down align-middle" v-text="me.name"></span>
        </li>
      </ul>
    </header>
    <router-view></router-view>
  </div>
</template>

<script>
import store from 'src/services/store';

export default {
  name: 'app',
  data() {
    return store;
  },
}
</script>

<style>
</style>
