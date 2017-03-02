<template>
  <div>
    <div class="jumbotron" v-if="!solutions.length">
      <p>No submission yet.</p>
      <router-link class="btn btn-primary" :to="`/quiz/${$route.params.id}`">Submit a solution</router-link>
    </div>
    <div class="card mb-3" v-for="(solution, index) in solutions">
      <div class="card-header" @click="onToggle(solution, index)">
        Submitted at {{formatTime(solution.createdAt)}}
        <div class="badge badge-info" v-text="solution.language.title"></div>
      </div>
      <vue-code class="code-area-auto collapse" :class="{show: solution.show}"
      ref="code"
      :value="solution.code" :options="getOptions(solution)" />
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
      this.solutions = data.reverse().map((item, index) => ({
        ...item,
        show: !index,
      }));
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
    onToggle(solution, index) {
      if (solution.show = !solution.show) {
        this.$nextTick(() => {
          const {cm} = this.$refs.code[index];
          cm && cm.refresh();
        });
      }
    },
  },
};
</script>
