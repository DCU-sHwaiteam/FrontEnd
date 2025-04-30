import axios from 'axios';

// 환경변수에서 API URL을 가져옴
const API_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8000';

// 🔹 회원가입 요청
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}register`, {
      email: userData.email,
      name: userData.name,
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

// 🔹 동아리 가입 요청 추가
export async function joinClub(userId, clubId) {
  try {
    const response = await axios.post(`${API_URL}api/join-club`, {
      user_id: userId,
      club_id: clubId,
    }, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("❌ 동아리 가입 요청 실패:", error.response?.data);
    throw error.response?.data;
  }
}

// 🔹 동아리 가입 승인 요청 추가
export async function approveMembership(userId, clubId, leaderEmail) {
  try {
    const response = await axios.post(`${API_URL}api/approve-membership`, {
      user_id: userId,
      club_id: clubId,
      leader_email: leaderEmail,
    }, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("❌ 동아리 가입 승인 실패:", error.response?.data);
    throw error.response?.data;
  }
}

// 🔹 로그인한 사용자 정보 조회 요청
export async function fetchCurrentUser() {
  try {
    const response = await axios.get(`${API_URL}current-user`, { withCredentials: true });
    return response.data.user;  // 성공 시 user 객체 반환
  } catch (error) {
    console.error("❌ 현재 사용자 정보 조회 실패:", error.response?.data);
    throw error.response?.data;
  }
}

