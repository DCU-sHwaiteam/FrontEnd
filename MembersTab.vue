<template>
  <v-container>
    <h2>멤버 관리</h2>
    <p>동아리 회원을 관리하는 공간입니다.</p>

    <!-- 신청 목록 보기 버튼 -->
    <v-btn color="primary" @click="openApplicationsDialog">신청 목록 보기</v-btn>

    <!-- 신청 목록 팝업 -->
    <v-dialog v-model="applicationsDialog" max-width="500px">
      <v-card>
        <v-card-title>신청 목록</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item v-for="applicant in applications" :key="applicant.id">
              <div class="member-item">
                <!-- 프로필 -->
                <div class="profile-container">
                  <v-avatar size="50">
                    <img :src="applicant.profile_image || defaultProfileImage" alt="프로필 사진" />
                  </v-avatar>
                </div>

                <div class="divider"></div>

                <!-- 정보 영역 -->
                <div class="info-container">
                  <div class="name">{{ applicant.name }}</div>
                  <div class="details">{{ applicant.department }} | {{ applicant.student_id }}</div>
                </div>

                <!-- 승인 버튼 -->
                <div class="button-container">
                  <v-btn color="green" @click="approveMember(applicant.id)">승인</v-btn>
                </div>
              </div>
            </v-list-item>
            <v-list-item v-if="applications.length === 0">
              <span>신청자가 없습니다.</span>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn color="grey" @click="applicationsDialog = false">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 현재 멤버 목록 -->
    <v-list>
      <v-list-item v-for="member in members" :key="member.id">
        <div class="member-item">
          <div class="profile-container">
            <v-avatar size="50">
              <img :src="member.profile_image || defaultProfileImage" alt="프로필 사진" />
            </v-avatar>
          </div>
          <div class="divider"></div>
          <div class="info-container">
            <div class="name">{{ member.name }}</div>
            <div class="details">{{ member.department }} | {{ member.student_id }}</div>
          </div>
          <div class="button-container">
            <v-btn color="red" @click="removeMember(member.id)">삭제</v-btn>
          </div>
        </div>
      </v-list-item>
      <v-list-item v-if="members.length === 0">
        <span>등록된 멤버가 없습니다.</span>
      </v-list-item>
    </v-list>
  </v-container>
</template>



<script>

import axios from 'axios';

const API_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8000';

import { 
  fetchClubApplications, 
  approveMembership, 
  deleteMember 
} from '@/services/authService'; // authService.js에서 함수 불러오기

export default {
  name: 'MembersTab',
  props: {
    clubId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      applicationsDialog: false,
      applications: [],
      members: [],
      defaultProfileImage: "https://via.placeholder.com/50"
    };
  },
  methods: {
    // 멤버 목록 불러오기 (axios 직접 사용, 필요하다면 authService에 함수 추가 가능)
    async fetchMembers() {
      try {
        const response = await axios.get(`${API_URL}clubs/${this.clubId}/members`, { 
        withCredentials: true 
        });
        this.members = await response.data;
      } catch (err) {
        console.error("멤버 목록 불러오기 실패", err);
        this.members = [];
      }
    },
    // 신청 목록 불러오기 (authService 함수 사용)
    async fetchApplications() {
      try {
        this.applications = await fetchClubApplications(this.clubId);
      } catch (err) {
        console.error("신청 목록 불러오기 실패", err);
        this.applications = [];
      }
    },
    openApplicationsDialog() {
      this.fetchApplications();
      this.applicationsDialog = true;
    },
    // 승인 (authService 함수 사용)
    async approveMember(applicantId) {
      try {
        await approveMembership(applicantId, this.clubId);
        await this.fetchApplications();
        await this.fetchMembers();
        this.$emit('members-updated', this.members);
      } catch (err) {
        console.error("멤버 승인 실패", err);
        alert("승인에 실패했습니다.");
      }
    },
    // 삭제 (authService 함수 사용)
    async removeMember(memberId) {
      try {
        await deleteMember(this.clubId, memberId);
        await this.fetchMembers();
        this.$emit('members-updated', this.members);
      } catch (err) {
        console.error("멤버 삭제 실패", err);
        alert("삭제에 실패했습니다.");
      }
    }
  },
  mounted() {
    this.fetchMembers();
  },
  watch: {
    clubId(newId, oldId) {
      if (newId !== oldId) {
        this.fetchMembers();
      }
    }
  }
};
</script>

<style scoped>
.member-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  justify-content: flex-start;
  gap: 15px;
}
.profile-container {
  flex: 0 0 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.divider {
  width: 2px;
  height: 40px;
  background-color: #ccc;
}
.info-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
}
.button-container {
  flex: 0 0 auto;
  margin-left: auto;
}
.name {
  font-weight: bold;
  font-size: 16px;
}
.details {
  font-size: 14px;
  color: #666;
}
</style>
  
