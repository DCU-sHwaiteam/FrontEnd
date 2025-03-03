import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/";

// 회원가입
export const registerUser = async (userData) => {
  try {
    const payload = {
      username: userData.email,  // Django에서 username 필수 → email을 username으로 저장
      email: userData.email,
      student_id: userData.studentId,
      department: userData.department,
      phone: userData.phone,
      password: userData.password,
    };

    console.log("Sending data:", payload);

    const response = await axios.post(`${API_URL}users/`, payload);
    return response.data;
  } catch (error) {
    console.error("Error during registration:", error.response ? error.response.data : error);
    throw error.response ? error.response.data : error;
  }
};

// 로그인
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}login/`, credentials);
    return response.data;
  } catch (error) {
    console.error("Login failed:", error.response ? error.response.data : error);
    throw error.response ? error.response.data : error;
  }
};



