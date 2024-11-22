<template>
    <aside class="sider">
        <h2 class="sider-title">Menu</h2>
        <ul class="sider-menu">
            <!-- Liên kết dành riêng cho Admin -->
            <template v-if="role === 'nhanvien'">
                <li class="sider-item">
                    <router-link to="/admin/dashboard" class="sider-link">Trang tổng quan</router-link>
                </li>
                <li class="sider-item">
                    <router-link to="/admin/sach" class="sider-link">Quản lý sách</router-link>
                </li>
                <li class="sider-item">
                    <router-link to="/admin/theodoi" class="sider-link">Quản lý mượn trả</router-link>
                </li>
                <li class="sider-item">
                    <a class="sider-link" @click="goToUserProfile">Thông tin tài khoản</a>
                </li>
            </template>
            <!-- Liên kết dành riêng cho User -->
            <template v-if="role === 'docgia'">
                <li class="sider-item">
                    <router-link to="/home" class="sider-link">Trang chủ</router-link>
                </li>
                <li class="sider-item">
                    <a class="sider-link" @click="goToUserBorrowHistory">Lịch sử mượn</a>
                </li>
                <li class="sider-item">
                    <a class="sider-link" @click="goToUserProfile">Tài
                        khoản</a>
                </li>
            </template>
        </ul>
    </aside>
</template>

<script>
import { getUserDataFromToken } from '@/services/getUserData.service';
export default {
    name: "Sider",
    data() {
        return {
        };
    },
    computed: {
        isAuthenticated() {
            return !!JSON.parse(localStorage.getItem("tokenuser"));
        },
        role() {
            const role = JSON.parse(localStorage.getItem('role'));
            return role; // Lấy trực tiếp giá trị từ localStorage
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
        async goToUserProfile() {
            const user = await getUserDataFromToken();  // Sử dụng service để lấy ID người dùng
            if (user._id) {
                // Điều hướng đến trang người dùng với ID lấy từ token
                this.$router.push(`/profile/${user._id}`);
            } else {
                console.log("Không tìm thấy token hoặc userId.");
            }
        },
        async goToUserBorrowHistory() {
            const user = await getUserDataFromToken();  // Sử dụng service để lấy ID người dùng
            if (user._id) {
                // Điều hướng đến trang lịch sử mươn với ID lấy từ token
                this.$router.push(`/history/${user._id}`);
            } else {
                console.log("Không tìm thấy token hoặc userId.");
            }
        }
    },
};
</script>

<style scoped>
@import "@/assets/style.css";
</style>
