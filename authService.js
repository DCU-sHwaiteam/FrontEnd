import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

export const register = async (userData) => {
  try {
    const response = await axios.post(${API_URL}register/, {
      email: userData.email,
      student_id: userData.studentId,
      department: userData.department,
      phone: userData.phone,
      password: userData.password,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const login = async (email, password) => {
  try {
    const response = await axios.post(${API_URL}login/, {
      email: email, // 기존: { email: { username, password } }
      password: password
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export async function createClub(clubData) {
  try {
    const response = await axios.post(${API_URL}create-club/, clubData);
    return response.data;
  } catch (error) {
    console.error("Error creating club", error);
    return { success: false };
  }
}

export async function fetchClubs() {
  try {
    const response = await axios.get(${API_URL}clubs/);
    return response.data;
  } catch (error) {
    console.error("Error fetching clubs", error);
    return [];
  }
}



