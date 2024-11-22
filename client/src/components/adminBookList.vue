<template>
    <div class="book-list">
        <h2>Quản Lý Sách</h2>
        <button class="btn btn-success" @click="openAddEditModal()">Thêm sách mới</button>
        <table>
            <thead>
                <tr>
                    <th>Mã sách</th>
                    <th>Tên sách</th>
                    <th>Đơn giá</th>
                    <th>Số quyển</th>
                    <th>Năm xuất bản</th>
                    <th>Nhà xuất bản</th>
                    <th>Tác giả</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="book in books" :key="book._id">
                    <td>{{ book.MASACH }}</td>
                    <td>{{ book.TENSACH }}</td>
                    <td>{{ book.DONGIA }}</td>
                    <td>{{ book.SOQUYEN }}</td>
                    <td>{{ book.NAMXUATBAN }}</td>
                    <td>{{ book.MANXB ? book.MANXB.TENNXB : 'Không có' }}</td>
                    <td>{{ book.TACGIA }}</td>
                    <td>
                        <button class="btn btn-secondary" @click="editBook(book)">Sửa</button>
                        <!-- <button class="btn btn-danger" @click="deleteBook(book._id)">Xóa</button> -->
                    </td>
                </tr>
            </tbody>
        </table>
        <AddEditBook :showModal="showModal" :book="selectedBook" @closeModal="closeModal" @saveBook="getBooks" />


    </div>
</template>

<script>
import axios from 'axios';
import AddEditBook from '@/components/adminEditBook.vue';

export default {
    name: 'BookList',
    components: {
        AddEditBook
    },
    data() {
        return {
            books: [],
            showModal: false,
            selectedBook: null, // Biến để giữ sách đang chỉnh sửa
        };
    },
    methods: {
        async getBooks() {
            try {
                const response = await axios.get('/api/sach');
                this.books = response.data;
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        },
        openAddEditModal() {
            this.selectedBook = null;
            this.showModal = true;
        },
        editBook(book) {
            this.selectedBook = book;
            this.showModal = true;
        },
        // async deleteBook(id) {
        //     try {
        //         await axios.delete(`/api/sach/${id}`);
        //         this.getBooks();
        //     } catch (error) {
        //         console.error('Error deleting book:', error);
        //     }
        // },
        closeModal() {
            this.showModal = false;
            this.selectedBook = null;
        }
    },
    mounted() {
        this.getBooks();
    }
};
</script>

<style scoped>
table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: 4px;
    text-align: left;
    border: 1.4px solid #ddd;
}

th {
    background-color: #f4f4f4;
    text-align: center;
    padding: 2px;
    font-weight: bolder;
}

.btn-success {
    margin-bottom: 10px;
}
</style>
