
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
    password: "1230",
    initialCredits: 999,
    fullName: "Thầy Quân (Admin)"
  },
  {
    username: "giaovien1",
    password: "1230",
    initialCredits: 10,
    fullName: "Cô Lan (GV Toán)"
  },
  {
    username: "giaovien2",
    password: "4560",
    initialCredits: 1,
    fullName: "Thầy Hùng (GV Văn)"
  },
{
    username: "aibienphap",
    password: "123456",
    initialCredits: 2,
    fullName: "Thầy cô nhóm Ai Giáo dục"
  }
];
