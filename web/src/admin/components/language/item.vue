<template>
  <div>
    <form class="card" v-if="editing" @submit.prevent="onOK">
      <div class="card-block">
        <div class="form-group">
          <label>Title</label>
          <input class="form-control" v-model="lang.title">
        </div>
        <div class="form-group">
          <label>Value</label>
          <input class="form-control" v-model="lang.value">
        </div>
      </div>
      <div class="card-footer">
        <button type="submit" class="btn btn-primary">OK</button>
        <button type="reset" class="btn btn-default" @click="onCancel">Cancel</button>
      </div>
    </form>
    <div class="card" v-else>
      <div class="card-block">
        <div class="float-right">
          <a href="#" @click.prevent="onEdit">
            <i class="fa fa-edit"></i>
          </a>
        </div>
        <div class="form-group">
          <label>Title</label>
          <div class="text-center">
            <strong v-text="lang.title"></strong>
          </div>
        </div>
        <div class="form-group">
          <label>Value</label>
          <div class="text-center" v-text="lang.value"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['lang', 'state'],
  computed: {
    editing() {
      return this.state && this.state.editing;
    },
  },
  methods: {
    onEdit() {
      this.$emit('edit', this.lang);
    },
    onOK() {
      this.$emit('submit', this.lang);
    },
    onCancel() {
      this.$emit('cancel', this.lang);
    },
  },
};
</script>
