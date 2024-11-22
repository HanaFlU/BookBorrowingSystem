<script>
import Header from "@/components/header.vue";
import Sider from "@/components/sider.vue";

export default {
  components: {
    Header,
    Sider,
  },
  data() {
    return {
      isSiderVisible: true, // Trạng thái hiển thị Sider
    };
  },
  methods: {
    toggleSider() {
      this.isSiderVisible = !this.isSiderVisible; // Đảo ngược trạng thái
    },
  },
};
</script>

<template>
  <div id="app">
    <!-- Header -->
    <Header />
    <!-- Nút ẩn/hiện Sider-->
    <button class="toggle-sider-btn" @click="toggleSider">
      <img src="/menu-icon.svg" height="30px" width="30px" alt="menu">
    </button>
    <!-- Body Layout -->
    <div class="body">
      <!-- Sider -->
      <div v-if="isSiderVisible" class="sider">
        <Sider />
      </div>

      <!-- Main -->
      <div :class="['main', { 'full-width': !isSiderVisible }]">
        <router-view />
      </div>
    </div>
  </div>
</template>
