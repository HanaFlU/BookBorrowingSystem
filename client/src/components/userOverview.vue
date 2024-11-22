<template>
    <div>
        <h2>Danh sách sách</h2>
        <table boder="1">
            <thead>
                <tr>
                    <th>Chọn</th>
                    <th>Mã sách</th>
                    <th>Tên sách</th>
                    <th>Đơn giá</th>
                    <th>Số quyển</th>
                    <th>Năm xuất bản</th>
                    <th>Nhà xuất bản</th>
                    <th>Tác giả</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="book in books" :key="book.MASACH">
                    <td>
                        <input type="checkbox" :disabled="book.SOQUYEN <= 0"
                            @change="toggleSelectBook(book, $event.target.checked)" />
                    </td>
                    <td>{{ book.MASACH }}</td>
                    <td>{{ book.TENSACH }}</td>
                    <td>{{ book.DONGIA }}</td>
                    <td>{{ book.SOQUYEN }}</td>
                    <td>{{ book.NAMXUATBAN }}</td>
                    <td>{{ book.MANXB ? book.MANXB.TENNXB : 'Không có' }}</td>
                    <td>{{ book.TACGIA }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import axios from "axios";

export default {
    props: {
        selectedBooks: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            books: [], // Danh sách sách từ API
        };
    },
    mounted() {
        this.getBooks();
    },
    methods: {
        async getBooks() {
            try {
                const response = await axios.get("http://localhost:3000/api/sach");
                this.books = response.data;
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        },
        toggleSelectBook(book, isSelected) {
            if (isSelected) {
                this.$emit("select-book", book);
            } else {
                this.$emit("deselect-book", book);
            }
        },
    },
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
</style>
