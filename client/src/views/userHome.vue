<template>
    <div>
        <div class="btn-inner">
            <button class="btn-borrow" @click="borrowBooks" :disabled="selectedBooks.length === 0">
                Mượn sách
            </button>
        </div>

        <BookOverview :selectedBooks="selectedBooks" @select-book="addBook" @deselect-book="removeBook" />
    </div>
</template>

<script>
import axios from "axios";
import BookOverview from "@/components/userOverview.vue";
import { getUserDataFromToken } from '@/services/getUserData.service';

export default {
    components: {
        BookOverview,
    },
    data() {
        return {
            selectedBooks: [], // Danh sách sách được chọn
        };
    },
    methods: {
        addBook(book) {
            this.selectedBooks.push(book);
        },
        removeBook(book) {
            this.selectedBooks = this.selectedBooks.filter(
                (b) => b.MASACH !== book.MASACH
            );
        },
        async borrowBooks() {
            try {
                const user = await getUserDataFromToken();
                const borrowData = this.selectedBooks.map((book) => ({
                    MADOCGIA: user._id,
                    MASACH: book._id,
                }));

                await axios.post("http://localhost:3000/api/theodoi", borrowData);

                alert("Mượn sách thành công!");
                this.selectedBooks = [];
            } catch (error) {
                console.error("Error borrowing books:", error);
            }
        },
    },
};
</script>

<style scoped>
/* Các kiểu cho nút */
.btn-borrow {
    padding: 10px 20px;
    background-color: #89b7e8;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
}

/* Đổi màu khi nút bị vô hiệu hóa */
.btn-borrow:disabled {
    background-color: #d6d6d6;
    cursor: not-allowed;
}

/* Hiệu ứng hover khi nút được bật */
.btn-borrow:hover:enabled {
    background-color: #0056b3;
}

/* Đảm bảo BookOverview sẽ hiển thị dưới nút */
.book-overview-container {
    width: 100%;
}
</style>
