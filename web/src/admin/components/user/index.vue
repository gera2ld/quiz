<template>
  <div class="flex-auto row align-content-start scroll-y">
    <div class="col-6 mb-3" v-for="user in list.data" :key="user">
      <div class="card" :class="{'user-disabled': !user.isEnabled}">
        <div class="card-block">
          <div class="float-right">
            <router-link :to="`/user/${user.id}`">
              <i class="fa fa-arrows-alt"></i>
            </router-link>
            <a href="#" @click.prevent="toggleUser(user)">
              <i class="fa" :class="`fa-toggle-${user.isEnabled ? 'on' : 'off'}`"></i>
            </a>
          </div>
          <div class="mb-2">
            <div class="avatar align-middle">
              <img :src="user.avatar">
            </div>
            <span class="align-middle" v-text="`${user.name} (${user.login})`" />
            <a :href="`https://github.com/${user.login}`" target="_blank">
              <i class="fa fa-external-link"></i>
            </a>
          </div>
          <div>
            <div class="badge badge-info" v-for="perm in user.permissions" v-text="perm"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from 'src/services/store';
import Detail from './detail';
import {loadList, updateItem} from './utils';

export default {
  components: {
    Detail,
  },
  data() {
    return store.user;
  },
  created() {
    loadList();
  },
  methods: {
    toggleUser(user) {
      updateItem({
        id: user.id,
        isEnabled: !user.isEnabled,
      });
    },
  },
};
</script>

<style>
.user-disabled {
  color: #999;
  background: #fbfbfb;
}
</style>
