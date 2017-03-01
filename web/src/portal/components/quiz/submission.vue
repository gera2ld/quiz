<template>
  <div>
    <div class="card" v-for="solution in solutions">
      <div class="card-header">
        Submitted at {{formatTime(solution.createdAt)}}
        <div class="badge badge-info" v-text="solution.language.title"></div>
      </div>
      <div class="card-body">
        <vue-code class="code-area" :value="solution.code" :options="getOptions(solution)" />
      </div>
    </div>
  </div>
</template>

<script>
import {Me} from 'src/services/restful';
import VueCode from 'src/components/vue-code';

export default {
  components: {
    VueCode,
  },
  data() {
    return {
      solutions: [],
    };
  },
  created() {
    const {id} = this.$route.params;
    Me.Quiz.model(id).get('solutions').then(data => {
      this.solutions = data;
    });
  },
  methods: {
    formatTime(time) {
      const date = new Date(time);
      return date.toLocaleString();
    },
    getOptions(solution) {
      return {
        mode: solution.language.value,
        readOnly: true,
      };
    },
  },
};
</script>
