const TheoDoiMuonSach = require("../models/theoDoiMuonSach.model");
const Sach = require("../models/sach.model");
// const { ObjectId } = require("mongodb");
const ApiError = require("../api-error");

// [GET] /api/theodoi/
exports.getAllTheoDoiMuonSach = async (req, res, next) => {
    try {
        const { name } = req.query;
        let theodois;
        if (name) { //findByName
            theodois = await TheoDoiMuonSach.find({
                name: { $regex: new RegExp(name), $options: "i" },
            });
        }
        else { //findAll
            theodois = await TheoDoiMuonSach.find({});
        }
        res.status(200).json(theodois);
    } catch (err) {
        return next(
            new ApiError(500, `Có lỗi xảy ra khi lấy ra đối tượng`)
        );
    }
};

// [POST] /api/theodoi/
exports.createTheoDoiMuonSach = async (req, res, next) => {
    try {
        const borrowData = req.body;
        // console.log(borrowData);
        for (const borrow of borrowData) {
            const sach = await Sach.findById(borrow.MASACH);
            if (!sach || sach.SOQUYEN <= 0) {
                return res.status(400).json({ message: 'Sách không đủ số lượng!' });
            }

            // Tạo thông tin mượn sách
            const newBorrow = new TheoDoiMuonSach({
                MADOCGIA: borrow.MADOCGIA,
                MASACH: borrow.MASACH,
                NGAYTRA: null
            });
            await newBorrow.save();

            // Giảm số lượng sách
            sach.SOQUYEN -= 1;
            await sach.save();
        }

        res.status(201).json({ message: 'Mượn sách thành công!' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Lỗi khi mượn sách.' });
    }
};

// [GET] /api/theodoi/:id
exports.getTheoDoiMuonSachByID = async (req, res, next) => {
    try {
        const userId = req.params.id;

        // Tìm lịch sử mượn sách của người dùng theo MADOCGIA
        const theodoi = await TheoDoiMuonSach.find({ MADOCGIA: userId })  // Tìm theo MADOCGIA
            .populate('MASACH')  // Nối kết thông tin sách thông qua MASACH
            .exec();

        // Kiểm tra nếu không có bản ghi
        if (theodoi.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy lịch sử mượn sách' });
        }

        // Trả về kết quả
        res.status(200).json(theodoi);
    } catch (err) {
        return next(
            new ApiError(500, `Có lỗi xảy ra khi lấy lịch sử mượn sách của người dùng với mã ${req.params.madocgia}`)
        );
    }
};


// [PUT] /api/theodoi/:id
// [PUT] /api/theodoi/:id
exports.updateTheoDoiMuonSach = async (req, res, next) => {
    try {
        const { status } = req.body; // Lấy trạng thái từ body
        let { NGAYTRA } = req.body; // Lấy ngày trả từ body (nếu có)

        // Nếu trạng thái là "Đã trả" và không có ngày trả, gán giá trị ngày trả là thời gian hiện tại
        if (status === 'Đã trả' && !NGAYTRA) {
            NGAYTRA = Date.now();
        }

        const record = await TheoDoiMuonSach.findById(req.params.id);

        if (!record) {
            return res.status(404).json({ message: 'Không tìm thấy phiếu mượn.' });
        }

        record.status = status;
        if (NGAYTRA) {
            record.NGAYTRA = NGAYTRA; // Cập nhật ngày trả
        }

        await record.save();
        res.json(record); // Trả về record đã được cập nhật
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái phiếu mượn:', error);
        res.status(500).json({ message: 'Lỗi server khi cập nhật phiếu mượn.' });
    }
};


// [DELETE] /api/theodoi/:id
exports.deleteTheoDoiMuonSach = async (req, res, next) => {
    try {
        await TheoDoiMuonSach.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Xóa thành công" });
    } catch (err) {
        return next(
            new ApiError(500, `Có lỗi xảy ra khi xóa đối tượng có id=${req.params.id}`)
        );
    }
};
