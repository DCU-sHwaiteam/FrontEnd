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
    const response = await axios.post(`${API_URL}join-club`, {
      user_id: userId,
      club_id: clubId,
    }, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("❌ 동아리 가입 요청 실패:", error.response?.data);
    throw error.response?.data;
  }
}

// 🔹 동아리 가입 승인 (leader_email 파라미터 제거)
export async function approveMembership(userId, clubId) { // 변경된 부분
  try {
    const response = await axios.post(`${API_URL}approve-membership`, {
      user_id: userId,
      club_id: clubId
      // leader_email은 백엔드에서 세션으로 처리
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

// 🔹 동아리 가입 신청자 목록 조회
export async function fetchClubApplications(clubId) {
  try {
    const response = await axios.get(`${API_URL}clubs/${clubId}/applications`, { 
      withCredentials: true 
    });
    return response.data;
  } catch (error) {
    console.error("❌ 신청자 목록 조회 실패:", error.response?.data);
    throw error.response?.data;
  }
}

// 🔹 동아리 멤버 삭제
export async function deleteMember(clubId, userId) {
  try {
    const response = await axios.delete(`${API_URL}clubs/${clubId}/members/${userId}`, { 
      withCredentials: true 
    });
    return response.data;
  } catch (error) {
    console.error("❌ 멤버 삭제 실패:", error.response?.data);
    throw error.response?.data;
  }
}

// 출석 리스트 조회
export async function fetchAttendanceList(clubId) {
  try {
    const response = await axios.get(`${API_URL}clubs/${clubId}/attendance`, { 
      withCredentials: true 
    });
    return response.data;
  } catch (error) {
    console.error("출석 리스트 조회 실패:", error.response?.data);
    return [];
  }
}

// 출석 생성
export async function createAttendanceRecord(clubId, data) {
  try {
    const response = await axios.post(
      `${API_URL}clubs/${clubId}/attendance`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("출석 생성 실패:", error.response?.data);
    throw error.response?.data;
  }
}

// 출석 체크
export async function markAttendance(clubId, week, pin) {
  try {
    const response = await axios.post(
      `${API_URL}clubs/${clubId}/attendance/mark`,
      { week, pin },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("출석 체크 실패:", error.response?.data);
    throw error.response?.data;
  }
}

// 출석 삭제
export async function deleteAttendanceRecord(clubId, week) {
  try {
    const response = await axios.delete(
      `${API_URL}clubs/${clubId}/attendance/${week}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("출석 삭제 실패:", error.response?.data);
    throw error.response?.data;
  }
}

// 공지사항 목록 조회
export async function fetchAnnouncements(clubId) {
  try {
    const response = await axios.get(`${API_URL}clubs/${clubId}/announcements`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("공지사항 목록 조회 실패:", error.response?.data);
    return [];
  }
}

// 공지사항 추가
export async function addAnnouncement(clubId, data) {
  try {
    const response = await axios.post(
      `${API_URL}clubs/${clubId}/announcements`,
      data,
      { 
        headers: { "Content-Type": "application/json" },  // ✅ 헤더 추가
        withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("공지사항 추가 실패:", error.response?.data);
    throw error.response?.data;
  }
}

// 공지사항 삭제
export async function deleteAnnouncement(clubId, announcementId) {
  try {
    const response = await axios.delete(
      `${API_URL}clubs/${clubId}/announcements/${announcementId}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("공지사항 삭제 실패:", error.response?.data);
    throw error.response?.data;
  }
}

// 갤러리 이미지 목록 조회
export async function fetchGalleryImages(clubId) {
  try {
    const response = await axios.get(`${API_URL}clubs/${clubId}/gallery`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("갤러리 이미지 목록 조회 실패:", error.response?.data);
    return [];
  }
}

// 갤러리 이미지 업로드
export async function uploadGalleryImage(clubId, { title, description, file }) {
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", file);

    const response = await axios.post(
      `${API_URL}clubs/${clubId}/gallery`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("갤러리 이미지 업로드 실패:", error.response?.data);
    throw error.response?.data;
  }
}

// 갤러리 이미지 삭제
export async function deleteGalleryImage(clubId, imageId) {
  try {
    const response = await axios.delete(
      `${API_URL}clubs/${clubId}/gallery/${imageId}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("갤러리 이미지 삭제 실패:", error.response?.data);
    throw error.response?.data;
  }
}

// 일정 목록 조회
export async function fetchSchedules(clubId) {
  try {
    const response = await axios.get(`${API_URL}clubs/${clubId}/schedule`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("일정 목록 조회 실패:", error.response?.data);
    return [];
  }
}

// 일정 추가
export async function addSchedule(clubId, event) {
  try {
    const response = await axios.post(
      `${API_URL}clubs/${clubId}/schedule`,
      event,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("일정 추가 실패:", error.response?.data);
    throw error.response?.data;
  }
}

// 일정 삭제
export async function deleteSchedule(clubId, scheduleId) {
  try {
    const response = await axios.delete(
      `${API_URL}clubs/${clubId}/schedule/${scheduleId}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("일정 삭제 실패:", error.response?.data);
    throw error.response?.data;
  }
}

// 출석 기록 조회
export async function fetchAttendanceRecords(clubId, week) {
  try {
    const response = await axios.get(
      `${API_URL}clubs/${clubId}/attendance/${week}/records`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("출석 기록 조회 실패:", error.response?.data);
    throw error.response?.data;
  }
}

// 동아리 멤버 조회
export async function fetchClubMembers(clubId) {
  try {
    const response = await axios.get(
      `${API_URL}clubs/${clubId}/members`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("멤버 조회 실패:", error.response?.data);
    throw error.response?.data;
  }
}
