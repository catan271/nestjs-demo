export const errors = {
    // Common
    INVALID_ID: 'Id không hợp lệ',
    NOT_FOUND: 'Không tìm thấy',

    // Auth
    WRONG_PASSWORD: 'Tên đăng nhập hoặc mật khẩu không đúng',
    ACCOUNT_NOT_ACTIVE: 'Tài khoản đang bị khoá',
    USER_NOT_FOUND: 'Không tìm thấy tài khoản',
    INVALID_ACCESS_TOKEN: 'Token không hợp lệ',
    EMAIL_NOT_FOUND: 'Không tìm thấy email',

    // Users
    EMAIL_TAKEN: 'Email đã được sử dụng',
    STUDENT_NUMBER_REQUIRED: 'Phải có mã sinh viên',

    // Classes
    CLASS_NUMBER_TAKEN: 'Mã lớp đã được sử dụng',
    DELETE_SELF: 'Không thể xóa chính mình khỏi lớp',
    ALREADY_IN_CLASS: 'Đã có trong lớp này',

    // Members
    MEMBER_ALREADY_IN_CLASS: 'Thành viên đã trong lớp',

    // Quiz
    INVALID_QUESTIONS_AND_KEYS: 'Câu hỏi và đáp án không hợp lệ',
    MISSING_POSITION: 'Thiếu tọa độ',
    TOO_DISTANCED: 'Vị trí ở quá xa nơi điểm danh',
    QUIZ_CLOSED: 'Quiz đã đóng',
};
