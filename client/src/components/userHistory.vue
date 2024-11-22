<template>
    <div class="borrow-history">
        <h2>Lịch sử mượn sách</h2>

        <!-- Nếu không có lịch sử mượn -->
        <div v-if="borrowRecords.length === 0">
            <p>Hiện tại bạn chưa mượn sách nào.</p>
        </div>

        <!-- Danh sách lịch sử mượn sách -->
        <div v-else>
            <div v-for="(record, index) in borrowRecords" :key="record._id" class="borrow-record">
                <div class="record-header">
                    <strong>Phiếu mượn #{{ index + 1 }}</strong>
                </div>

                <!-- Thông tin đơn mượn -->
                <div class="record-item">
                    <strong>Ngày mượn:</strong> {{ formatDate(record.NGAYMUON) }}
                </div>
                <div class="record-item" v-if="record.NGAYTRA">
                    <strong>Ngày trả:</strong> {{ formatDate(record.NGAYTRA) }}
                </div>
                <div class="record-item" v-else>
                    <strong>Ngày trả:</strong> Chưa trả
                </div>

                <!-- Bảng thông tin sách -->
                <table class="borrow-table">
                    <thead>
                        <tr>
                            <th>Mã sách</th>
                            <th>Tên sách</th>
                            <th>Giá sách</th>
                            <th>Số quyển</th>
                            <th>Năm xuất bản</th>
                            <th>Tác giả</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(book, bookIndex) in record.books" :key="book._id">
                            <td>{{ book.MASACH }}</td>
                            <td>{{ book.TENSACH }}</td>
                            <td>{{ formatCurrency(book.DONGIA) }}</td>
                            <td>{{ book.SOQUYEN }}</td>
                            <td>{{ book.NAMXUATBAN }}</td>
                            <td>{{ book.TACGIA }}</td>
                        </tr>
                    </tbody>
                </table>

                <!-- Thêm khoảng cách giữa các đơn mượn -->
                <div v-if="index < borrowRecords.length - 1" class="divider"></div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { getUserDataFromToken } from '@/services/getUserData.service';

export default {
    data() {
        return {
            borrowRecords: [], // Lịch sử mượn sách
        };
    },
    created() {
        this.fetchBorrowRecords();
    },
    methods: {
        // Hàm lấy lịch sử mượn sách của người dùng
        async fetchBorrowRecords() {
            const user = await getUserDataFromToken();
            if (!user || !user._id) {
                console.error('Không tìm thấy thông tin người dùng');
                return;
            }

            try {
                const response = await axios.get(`/api/theodoi/${user._id}`);
                this.borrowRecords = this.groupBooksByBorrow(response.data) || [];
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu lịch sử mượn sách:', error);
            }
        },
        // Hàm nhóm sách theo ngày, giờ và phút
        groupBooksByBorrow(records) {
            const groupedRecords = [];
            let currentRecord = null;

            records.forEach((record) => {
                const borrowDate = new Date(record.NGAYMUON);
                // Lấy ngày, giờ và phút (bỏ qua giây và mili giây)
                const borrowDateStr = borrowDate.toISOString().slice(0, 16); // yyyy-mm-ddTHH:mm
                console.log("record", record);
                // Kiểm tra nếu là sách mượn cùng thời điểm
                const isSameBorrowTime = currentRecord && currentRecord.NGAYMUON === borrowDateStr;

                if (isSameBorrowTime) {
                    // Nếu sách được mượn cùng thời điểm (ngày, giờ và phút), thêm vào cùng một đơn mượn
                    currentRecord.books.push(record.MASACH);
                } else {
                    // Nếu là đơn mượn mới, tạo một nhóm mới
                    if (currentRecord) {
                        groupedRecords.push(currentRecord);
                    }
                    currentRecord = {
                        NGAYMUON: borrowDateStr,
                        NGAYTRA: record.NGAYTRA,
                        books: [record.MASACH], // Thêm sách vào nhóm mượn
                    };
                }
            });

            // Thêm đơn mượn cuối cùng vào danh sách
            if (currentRecord) {
                groupedRecords.push(currentRecord);
            }
            console.log(groupedRecords);
            return groupedRecords;
        },
        // Hàm định dạng ngày
        formatDate(dateString) {
            const date = new Date(dateString);
            return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
        },
        // Hàm định dạng giá
        formatCurrency(amount) {
            return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        }
    },


};
</script>

<style scoped>
.borrow-history {
    padding: 20px;
}

h2 {
    text-align: center;
    font-size: 24px;
    margin-bottom: 20px;
}

.borrow-record {
    padding: 15px;
    border: 1.5px solid #ddd;
    background-color: #f9f9f9;
    margin-bottom: 20px;
    border-radius: 8px;
}

.record-header {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
}

.borrow-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
}

.borrow-table th,
.borrow-table td {
    padding: 8px 12px;
    text-align: left;
    border: 1px solid #ddd;
}

.borrow-table th {
    background-color: #f4f4f4;
    font-weight: bold;
}

.record-item {
    margin-bottom: 8px;
    font-size: 16px;
}

.record-item strong {
    font-weight: bold;
}

.record-item:last-child {
    margin-bottom: 0;
}

.divider {
    margin-top: 20px;
    border-top: 1px solid #ddd;
}
</style>
