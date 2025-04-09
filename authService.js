import axios from 'axios';

// Flask 서버의 퍼블릭 IP로 변경 (EC2 퍼블릭 IP 사용)
const API_URL = 'http://43.203.36.43:5000/api/';  

// 🔹 회원가입 요청
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}register`, {
      email: userData.email,
      student_id: userData.studentId,
      department: userData.department,
      phone: userData.phone,
      password: userData.password,
    }, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("❌ 회원가입 실패:", error.response?.data);
    throw error.response?.data;
  }
};

// 🔹 로그인 요청
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}login`, { email, password }, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("❌ 로그인 실패:", error.response?.data);
    throw error.response?.data;
  }
};

// 🔹 동아리 생성 요청
export async function createClub(clubData) {
  try {
    const response = await axios.post(`${API_URL}create-club`, clubData, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("❌ 동아리 생성 실패:", error.response?.data);
    return { success: false };
  }
}

// 🔹 동아리 목록 조회 요청
export async function fetchClubs() {
  try {
    const response = await axios.get(`${API_URL}clubs`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("❌ 동아리 목록 조회 실패:", error.response?.data);
    return [];
  }
}

