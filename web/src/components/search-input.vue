<template>
  <div v-dropdown="{click: false, focus: 'open'}">
    <input class="form-control" dropdown-toggle v-model="searchText">
    <div class="dropdown-menu" v-show="validItems.length">
      <a class="dropdown-item" href="#" v-for="item in validItems"
      :class="{active: item.active}"
      @click.prevent="onClick(item)" v-text="item.title"></a>
    </div>
  </div>
</template>

<script>
export default {
  props: ['items', 'filtered', 'search'],
  data() {
    return {
      searchText: '',
      focused: false,
    };
  },
  computed: {
    validItems() {
      if (this.filtered) return this.filtered;
      const items = this.items || [];
      const search = this.searchText.toLowerCase();
      return items.filter(item => ~(item.search || '').indexOf(search));
    },
  },
  watch: {
    search(search) {
      this.searchText = search;
    },
    searchText(text) {
      if (text !== this.search) {
        text = text.toLowerCase();
        this.$emit('search', text);
      }
    },
  },
  methods: {
    onClick(item) {
      this.$emit('pick', item);
    },
  },
};
</script>

<style>
</style>
