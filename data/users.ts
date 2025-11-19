
export interface UserAccount {
  username: string;
  password: string;
  initialCredits: number;
  fullName: string;
}

// === DANH SÁCH TÀI KHOẢN NỘI BỘ ===
// Bạn hãy thêm/sửa/xóa tài khoản tại đây.
// Hệ thống sẽ chạy dựa trên danh sách này, KHÔNG kết nối mạng.
export const USERS: UserAccount[] = [
  {
    username: "admin",
    password: "123",
    initialCredits: 999,
    fullName: "Thầy Quân (Admin)"
  },
  {
    username: "giaovien1",
    password: "123",
    initialCredits: 10,
    fullName: "Cô Lan (GV Toán)"
  },
  {
    username: "giaovien2",
    password: "456",
    initialCredits: 1,
    fullName: "Thầy Hùng (GV Văn)"
  }
];
