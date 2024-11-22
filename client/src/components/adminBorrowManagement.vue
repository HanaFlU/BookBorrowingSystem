<template>
    <div class="admin-borrow-management">
        <h2>Quản lý phiếu mượn sách</h2>

        <!-- Nếu không có phiếu mượn -->
        <div v-if="borrowRecords.length === 0">
            <p>Không có phiếu mượn nào cần xử lý.</p>
        </div>

        <!-- Danh sách phiếu mượn -->
        <div v-else>
            <div v-for="(record, index) in borrowRecords" :key="record._id" class="borrow-record">
                <div class="record-header">
                    <strong>Phiếu mượn #{{ index + 1 }}</strong>
                </div>

                <!-- Thông tin đơn mượn -->
                <div class="record-item">
                    <strong>Người mượn:</strong> {{ getReaderName(record.MADOCGIA) }}
                </div>
                <div class="record-item">
                    <strong>Ngày mượn:</strong> {{ formatDate(record.NGAYMUON) }}
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
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(book, bookIndex) in record.books" :key="book._id">
                            <td>{{ getBook(book.MASACH).MASACH }}</td>
                            <td>{{ getBook(book.MASACH).TENSACH }}</td>
                            <td>{{ formatCurrency(getBook(book.MASACH).DONGIA) }}</td>
                            <td>{{ getBook(book.MASACH).SOQUYEN }}</td>
                            <td>{{ getBook(book.MASACH).NAMXUATBAN }}</td>
                            <td>{{ getBook(book.MASACH).TACGIA }}</td>
                            <td>
                                <select v-model="book.status" @change="updateStatus(record._id, book.status, book._id)">
                                    <option value="Chưa lấy sách">Chưa lấy sách</option>
                                    <option value="Đã lấy sách">Đã lấy sách</option>
                                    <option value="Đã trả">Đã trả</option>
                                </select>
                            </td>

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
export default {
    data() {
        return {
            borrowRecords: [], // Danh sách phiếu mượn
            readers: [], // Danh sách độc giả (ví dụ từ API khác)
            books: [], // Danh sách sách (ví dụ từ API khác)
        };
    },
    created() {
        this.fetchBorrowRecords().catch(error => {
            console.error('Lỗi khi tạo thành phần:', error);
        });
        this.fetchReaders(); // Lấy danh sách độc giả
        this.fetchBooks();   // Lấy danh sách sách
    },
    methods: {
        // Lấy danh sách phiếu mượn
        async fetchBorrowRecords() {
            try {
                const response = await axios.get('/api/theodoi');
                const rawRecords = response.data.map(record => ({
                    ...record,
                    newStatus: record.status, // Khởi tạo trạng thái hiện tại
                }));

                // Nhóm phiếu mượn
                this.borrowRecords = this.groupBorrowRecords(rawRecords);
                console.log(this.borrowRecords);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu phiếu mượn:', error);
            }
        },
        // Lấy danh sách độc giả
        async fetchReaders() {
            try {
                const response = await axios.get('http://localhost:3000/api/docgia');
                this.readers = response.data;
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu độc giả:', error);
            }
        },

        // Lấy danh sách sách
        async fetchBooks() {
            try {
                const response = await axios.get('http://localhost:3000/api/sach');
                this.books = response.data;
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu sách:', error);
            }
        },

        // Hàm lấy tên độc giả từ MADOCGIA
        getReaderName(madocgia) {
            const reader = this.readers.find((reader) => reader._id === madocgia);
            return reader ? reader.HOLOT + " " + reader.TEN : 'Không tìm thấy độc giả';
        },

        // Hàm lấy tên sách từ MASACH
        getBook(masach) {
            const book = this.books.find((book) => book._id === masach);
            return book ? book : 'Không tìm thấy sách';
        },
        // Hàm cập nhật trạng thái phiếu mượn
        async updateStatus(recordId, newStatus, bookId) {
            console.log(recordId, newStatus, bookId);
            try {
                // Tạo dữ liệu cần cập nhật
                let updatedData = { status: newStatus };
                if (newStatus === 'Đã trả') {
                    updatedData.NGAYTRA = Date.now(); // Cập nhật ngày trả
                }

                // Gửi yêu cầu PUT để cập nhật trạng thái phiếu mượn
                const response = await axios.put(`/api/theodoi/${bookId}`, updatedData);

                // Cập nhật giao diện sau khi cập nhật thành công
                const record = this.borrowRecords.find(record => record._id === recordId);
                if (record) {
                    // Cập nhật trạng thái phiếu mượn
                    const book = record.books.find(b => b._id === bookId);
                    if (book) {
                        book.status = response.data.status || newStatus; // Đồng bộ với giá trị trả về từ API
                        book.NGAYTRA = response.data.NGAYTRA || Date.now(); // Cập nhật ngày trả
                    }
                }
                alert('Cập nhật trạng thái thành công!');
            } catch (error) {
                console.error('Lỗi khi cập nhật trạng thái phiếu mượn:', error);
                alert('Cập nhật trạng thái thất bại. Vui lòng thử lại.');
            }
        },

        // Hàm nhóm sách theo người mượn, ngày, giờ và phút
        groupBorrowRecords(records) {
            const groupedRecords = [];

            records.forEach(record => {
                // Lấy ngày, giờ và phút (bỏ qua giây và mili giây)
                const borrowDate = new Date(record.NGAYMUON);
                const borrowDateStr = borrowDate.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm

                // Tìm nhóm có cùng người mượn và thời gian mượn
                let group = groupedRecords.find(
                    group =>
                        group.MADOCGIA === record.MADOCGIA &&
                        group.NGAYMUON === borrowDateStr
                );

                if (!group) {
                    // Nếu chưa có nhóm, tạo mới
                    group = {
                        MADOCGIA: record.MADOCGIA,
                        NGAYMUON: borrowDateStr,
                        books: [],
                    };
                    groupedRecords.push(group);
                }

                // Thêm sách vào nhóm
                group.books.push(record);
            });

            return groupedRecords;
        },



        // Hàm định dạng ngày
        formatDate(dateString) {
            const date = new Date(dateString);
            return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
        },

        // Hàm định dạng giá
        formatCurrency(amount) {
            if (!amount || isNaN(amount)) return 'Không xác định';
            return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        },

    },
};

</script>

<style scoped>
.admin-borrow-management {
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

.record-item select {
    margin-left: 8px;
}

.divider {
    margin-top: 20px;
    border-top: 1px solid #ddd;
}
</style>
