<template>
<v-container class="members-container">
<div class="members-header">
<div class="members-title">멤버 관리</div>
<v-btn class="members-apply-btn" @click="openApplicationsDialog">신청 목록 보기</v-btn>
</div>

<!-- 신청 목록 팝업 -->
<v-dialog v-model="applicationsDialog" max-width="500px">
<v-card>
<v-card-title>신청 목록</v-card-title>
<v-card-text>
<v-list>
<v-list-item v-for="applicant in applications" :key="applicant.id">
<div class="member-card">
<v-avatar size="40" class="member-avatar">
<img :src="applicant.profile_image || defaultProfileImage" alt="프로필 사진" />
</v-avatar>
<div class="member-info">
<div class="member-name">{{ applicant.name }}</div>
<div class="member-detail">{{ applicant.department }} | {{ applicant.student_id }}</div>
</div>
<v-btn color="#b8b4e3" class="approve-btn white--text" @click="approveMember(applicant.id)">승인</v-btn>
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

<!-- 현재 멤버 목록 (카드형) -->
<div class="members-list">
<div
v-for="member in members"
:key="member.id"
class="member-card"
>
<v-avatar size="40" class="member-avatar">
<img :src="member.profile_image || defaultProfileImage" alt="프로필 사진" />
</v-avatar>
<div class="member-info">
<div class="member-name">{{ member.name }}</div>
<div class="member-detail">내 정보</div>
</div>
<v-btn color="#f5a2a2" class="delete-btn white--text" @click="removeMember(member.id)">삭제</v-btn>
</div>
<div v-if="members.length === 0" class="empty-message">
등록된 멤버가 없습니다.
</div>
</div>
</v-container>
</template>

<script>
import axios from 'axios';
import {
fetchClubApplications,
approveMembership,
deleteMember
} from '@/services/authService';

const API_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8000';

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
// EC2 서버에서 /static/images/human.png로 접근 가능해야 함
defaultProfileImage: "/static/images/human.png"
};
},
methods: {
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
.members-container {
padding: 32px 0 0 0;
}
.members-header {
display: flex;
flex-direction: column;
align-items: center;
margin-bottom: 18px;
}
.members-title {
font-size: 1.3rem;
font-weight: bold;
color: #222;
margin-bottom: 10px;
}
.members-apply-btn {
background: #b8b4e3 !important;
color: #fff !important;
font-weight: 500;
min-width: 140px;
border-radius: 8px;
box-shadow: 0 2px 8px rgba(0,0,0,0.07);
margin-bottom: 18px;
}
.members-list {
display: flex;
flex-direction: column;
gap: 18px;
margin-top: 12px;
}
.member-card {
background: #f5f5f5;
border-radius: 12px;
box-shadow: none;
display: flex;
align-items: center;
padding: 14px 18px;
min-height: 56px;
margin-bottom: 0;
gap: 16px;
}
.member-avatar {
background: #e0e0e0;
}
.member-info {
flex: 1;
display: flex;
flex-direction: column;
justify-content: center;
margin-left: 10px;
}
.member-name {
font-size: 1rem;
font-weight: 500;
color: #222;
margin-bottom: 2px;
}
.member-detail {
font-size: 0.95rem;
color: #888;
}
.delete-btn {
background: #f5a2a2 !important;
color: #fff !important;
font-weight: 500;
border-radius: 8px;
min-width: 56px;
margin-left: auto;
}
.approve-btn {
background: #b8b4e3 !important;
color: #fff !important;
font-weight: 500;
border-radius: 8px;
min-width: 56px;
margin-left: auto;
}
.empty-message {
text-align: center;
color: #aaa;
margin-top: 32px;
font-size: 1.1rem;
}
</style>
  
