
import { USERS } from '../data/users';

export interface AuthResponse {
  status: 'success' | 'error';
  credits?: number;
  name?: string;
  message?: string;
  count?: number;
}

/**
 * Đăng nhập bằng hệ thống nội bộ (Local File)
 * Thay thế hoàn toàn việc gọi Google Sheet API.
 */
export const loginUser = async (username: string, password: string): Promise<AuthResponse> => {
  // Giả lập thời gian xử lý
  await new Promise(resolve => setTimeout(resolve, 300));

  try {
    // 1. Tìm tài khoản trong danh sách cứng (data/users.ts)
    const user = USERS.find(u => 
      u.username.trim().toLowerCase() === username.trim().toLowerCase() && 
      u.password === password.trim()
    );

    if (!user) {
      return { status: 'error', message: 'Sai tên đăng nhập hoặc mật khẩu.' };
    }

    // 2. Quản lý số dư (Lưu trong LocalStorage của trình duyệt)
    // Key lưu trữ: app_credits_local_<username>
    const storageKey = `app_credits_local_${user.username}`;
    const storedCredits = localStorage.getItem(storageKey);
    
    let currentCredits: number;

    if (storedCredits !== null) {
      // Nếu đã từng đăng nhập, lấy số dư đã lưu trong trình duyệt
      currentCredits = parseInt(storedCredits, 10);
    } else {
      // Nếu lần đầu tiên, lấy số dư gốc từ file config và lưu lại
      currentCredits = user.initialCredits;
      localStorage.setItem(storageKey, currentCredits.toString());
    }

    return {
      status: 'success',
      credits: currentCredits,
      name: user.fullName
    };

  } catch (error) {
    console.error('Local login error:', error);
    return { status: 'error', message: 'Lỗi hệ thống nội bộ.' };
  }
};

/**
 * Trừ 1 lượt sử dụng và cập nhật vào LocalStorage
 */
export const deductCredit = async (username: string): Promise<AuthResponse> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  try {
    // Tìm thông tin user để lấy đúng key storage
    const user = USERS.find(u => u.username.trim().toLowerCase() === username.trim().toLowerCase());
    
    // Nếu không tìm thấy user trong file config (trường hợp hiếm), dùng username thô
    const storageKey = `app_credits_local_${user ? user.username : username}`;
    const storedCredits = localStorage.getItem(storageKey);
    
    // Fallback: Nếu storage bị xóa, lấy lại giá trị gốc
    let currentCredits = storedCredits !== null 
      ? parseInt(storedCredits, 10) 
      : (user ? user.initialCredits : 0);

    if (currentCredits > 0) {
      const newCredits = currentCredits - 1;
      localStorage.setItem(storageKey, newCredits.toString());
      
      return {
        status: 'success',
        credits: newCredits
      };
    } else {
      return { status: 'error', message: 'Tài khoản đã hết lượt sử dụng.' };
    }

  } catch (error) {
    return { status: 'error', message: 'Lỗi khi trừ lượt.' };
  }
};

/**
 * Lấy tổng số tài khoản trong file cấu hình
 */
export const getUserCount = async (): Promise<number | null> => {
  return USERS.length;
};

/**
 * Hàm cũ (Legacy) - Giữ lại để không gây lỗi ở các file khác chưa xóa import
 */
export const recordUserName = async (name: string): Promise<void> => {};
