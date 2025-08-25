const mongoose = require('mongoose');

const theoDoiMuonSachSchema = mongoose.Schema({
    MADOCGIA: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "docgia",
        required: true,
    },
    MASACH: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "sach",
        required: true,
    },
    NGAYMUON: {
        type: Date,
        required: true,
        default: Date.now,
    },
    NGAYTRA: Date,
    status: {
        type: String,
        enum: ['Chưa lấy sách', 'Đã lấy sách', 'Đã trả'],  
        default: 'Chưa lấy sách',  
    },
});

module.exports = mongoose.model("theodoimuonsach", theoDoiMuonSachSchema, "THEODOIMUONSACH");
