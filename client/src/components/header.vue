<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark header">
        <a href="/home" class="navbar-brand">
            <img src="/logo.svg" alt="Logo" width="50" height="50" class="d-inline-block align-center">
            Hệ thống Thư viện
        </a>
        <ul class="ml-auto navbar-nav">

            <!-- Đăng nhập/Đăng xuất -->
            <li class="nav-item" v-if="isAuthenticated">
                <a @click="logout" class="nav-link" style="cursor: pointer;">Đăng xuất</a>
            </li>
            <li class="nav-item" v-if="!isAuthenticated">
                <router-link to="/login" class="nav-link">Đăng nhập</router-link>
            </li>
            <li class="nav-item" v-if="!isAuthenticated">
                <router-link to="/signup" class="nav-link">Đăng ký</router-link>
            </li>
        </ul>

    </nav>
</template>

<script>
export default {
    data() {
        return {};
    },
    computed: {
        isAuthenticated() {
            return !!localStorage.getItem("tokenuser");
        },
        role() {
            return localStorage.getItem("role");
        },
    },
    methods: {
        logout() {
            // Xóa token và thông tin người dùng khỏi localStorage
            localStorage.removeItem("tokenuser");
            localStorage.removeItem("role");

            // Điều hướng về trang đăng nhập
            this.$router.push("/login").then(() => {
                // Reload lại trang để đảm bảo trạng thái UI được cập nhật
                window.location.reload();
            });
        },
    },
};
</script>

<style scoped>
@import "@/assets/style.css";
</style>
