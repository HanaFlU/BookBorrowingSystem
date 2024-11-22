<template>
    <div class="user-profile" v-if="user">
        <h2>Thông tin tài khoản</h2>
        <div v-if="loading">Đang tải...</div>
        <div v-else>
            <div v-if="role === 'nhanvien'">
                <p><strong>MSNV:</strong> {{ user.MSNV }}</p>
                <p><strong>Họ và tên:</strong> {{ user.HOTENNV }}</p>
                <p><strong>Chức vụ:</strong> {{ user.CHUCVU }}</p>
                <p><strong>Địa chỉ:</strong> {{ user.DIACHI }}</p>
                <p><strong>Số điện thoại:</strong> {{ user.SODIENTHOAI }}</p>
            </div>
            <div v-else>
                <p><strong>Mã độc giả:</strong> {{ user.MADOCGIA }}</p>
                <p><strong>Họ và tên:</strong> {{ user.HOLOT }} {{ user.TEN }}</p>
                <p><strong>Ngày sinh:</strong> {{ formattedDate }}</p>
                <p><strong>Giới tính:</strong> {{ user.PHAI }}</p>
                <p><strong>Địa chỉ:</strong> {{ user.DIACHI }}</p>
                <p><strong>Số điện thoại:</strong> {{ user.DIENTHOAI }}</p>
            </div>
        </div>

        <div v-if="error" class="error">
            <p>{{ error }}</p>
        </div>

        <!-- Button Chỉnh Sửa Tài Khoản -->
        <div class="edit-button-container">
            <button @click="editAccount" class="edit-button">Chỉnh sửa tài khoản</button>
        </div>

        <!-- Modal chỉnh sửa tài khoản -->
        <div v-if="showEditModal" class="modal">
            <div class="modal-content">
                <span class="close" @click="closeEditModal">&times;</span>
                <h3>Chỉnh sửa thông tin</h3>
                <form @submit.prevent="saveChanges">
                    <!-- Họ tên -->
                    <div class="form-group">
                        <label for="fullname">Họ và tên:</label>
                        <input type="text" v-model="user.fullname" id="fullname" required />
                    </div>
                    <!-- Ngày sinh -->
                    <div v-if="role === 'docgia'" class="form-group">
                        <label for="dateOfBirth">Ngày sinh:</label>
                        <input type="date" v-model="user.NGAYSINH" id="dateOfBirth" required />
                    </div>
                    <!-- Giới tính -->
                    <div v-if="role === 'docgia'" class="form-group">
                        <label for="gender">Giới tính:</label>
                        <select v-model="user.PHAI" id="gender">
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                        </select>
                    </div>
                    <!-- Địa chỉ -->
                    <div class="form-group">
                        <label for="address">Địa chỉ:</label>
                        <input type="text" v-model="user.DIACHI" id="address" required />
                    </div>
                    <!-- Nút hành động -->
                    <div class="modal-actions">
                        <button type="submit" class="btn-save">Lưu thay đổi</button>
                        <button type="button" @click="closeEditModal" class="btn-cancel">Hủy</button>
                    </div>
                </form>
            </div>
        </div>

    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'UserProfile',
    data() {
        return {
            user: null,
            loading: true,
            error: null,
            showEditModal: false, // Trạng thái modal chỉnh sửa
        };
    },
    computed: {
        userId() {
            return this.$route.params.id;
        },
        formattedDate() {
            if (this.user && this.user.NGAYSINH) {
                const date = new Date(this.user.NGAYSINH);
                return date.toLocaleDateString("vi-VN");
            }
            return '';
        },
        role() {
            return JSON.parse(localStorage.getItem('role'));
        },
    },
    watch: {
        userId(newId) {
            this.fetchUserData(newId);
        }
    },
    created() {
        this.fetchUserData(this.userId);
    },
    methods: {
        async fetchUserData(id) {
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.get(`/api/${this.role}/${id}`);
                this.user = response.data;
                // Gộp họ và tên cho trường fullname
                if (this.role !== 'nhanvien') {
                    this.user.fullname = `${this.user.HOLOT} ${this.user.TEN}`;
                } else {
                    this.user.fullname = this.user.HOTENNV;
                }
            } catch (err) {
                this.error = "Không thể lấy thông tin người dùng.";
            } finally {
                this.loading = false;
            }
        },
        editAccount() {
            this.showEditModal = true; // Hiển thị modal chỉnh sửa
        },

        closeEditModal() {
            this.showEditModal = false; // Đóng modal chỉnh sửa
        },
        async saveChanges() {
            try {
                // Xử lý trường fullname thành họ lót và tên riêng
                if (this.role !== 'nhanvien') {
                    const nameParts = this.user.fullname.trim().split(' ');
                    const lastName = nameParts.pop(); // Lấy chữ cuối cùng làm Tên
                    const middleName = nameParts.join(' '); // Phần còn lại là Họ lót
                    this.user.HOLOT = middleName || ''; // Nếu không có họ lót, trả về chuỗi rỗng
                    this.user.TEN = lastName || ''; // Nếu không có tên, trả về chuỗi rỗng
                } else {
                    this.user.HOTENNV = this.user.fullname.trim();
                }

                // Gửi yêu cầu cập nhật dữ liệu
                const updatedData = {
                    ...this.user,
                    fullname: undefined, // Bỏ trường fullname (chỉ dùng cục bộ)
                };

                const response = await axios.put(`/api/${this.role}/${this.user._id}`, updatedData);
                alert('Thông tin đã được cập nhật!');
                this.showEditModal = false;
            } catch (err) {
                alert('Có lỗi xảy ra khi lưu thay đổi.');
            }
        },
    }

};
</script>

<style scoped>
.user-profile {
    padding: 30px;
    background-color: #f7f8fa;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    max-width: 800px;
    margin: 20px auto;
    font-family: 'Arial', sans-serif;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

h2 {
    font-size: 2rem;
    color: #333;
    margin-bottom: 15px;
    font-weight: bold;
}

p {
    font-size: 1.1rem;
    color: #555;
    line-height: 1.6;
    margin-bottom: 12px;
}

.error {
    color: red;
    font-weight: bold;
    text-align: center;
    margin-top: 20px;
}

p strong {
    color: #0e1b2a;
}

.edit-button-container {
    margin-top: 20px;
    text-align: center;
}

.edit-button {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    font-size: 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.edit-button:hover {
    background-color: #0056b3;
}

.modal {
    position: fixed;
    margin: auto;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: white;
    padding: 30px;
    border-radius: 8px;
    width: 500px;
    max-width: 100%;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.close {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 1.5rem;
    cursor: pointer;
}

h3 {
    font-size: 1.8rem;
    margin-bottom: 20px;
    text-align: center;
    color: #333;
}

.form-group {
    margin-bottom: 10px;
}

label {
    font-size: 1rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 0px;
}

input[type="text"],
input[type="email"],
input[type="date"] {
    width: 100%;
    padding: 12px;
    font-size: 1rem;
    border: 2px solid #ccc;
    border-radius: 6px;
    margin-top: 5px;
    transition: border-color 0.3s;
}

input[type="text"]:focus,
input[type="email"]:focus,
input[type="date"]:focus {
    border-color: #007bff;
    outline: none;
}

input[disabled] {
    background-color: #f0f0f0;
    cursor: not-allowed;
}

.modal-actions {
    display: flex;
    justify-content: space-between;
}

.modal-actions button {
    padding: 12px 20px;
    font-size: 1rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.modal-actions button[type="submit"] {
    background-color: #28a745;
    color: white;
}

.modal-actions button[type="button"] {
    background-color: #dc3545;
    color: white;
}

.modal-actions button:hover {
    opacity: 0.9;
}

select {
    width: 100%;
    padding: 12px;
    font-size: 1rem;
    border: 2px solid #ccc;
    border-radius: 6px;
    margin-top: 5px;
    transition: border-color 0.3s;
}

select:focus {
    border-color: #007bff;
    outline: none;
}
</style>