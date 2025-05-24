<template>
  <v-app>
    <v-app-bar app color="black" dark>
      <v-container>
        <v-row align="center" justify="space-between">
          <v-col>
            <v-toolbar-title>동아리 출석 명부</v-toolbar-title>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <!-- 주차별 출석 버튼 -->
    <v-container class="mt-16">
      <v-row>
        <v-col
          v-for="week in 16"
          :key="week"
          cols="3"
          md="2"
          class="d-flex justify-center"
        >
          <v-btn
            :style="{ backgroundColor: '#add8e6', color: '#000' }"
            @click="viewWeekAttendance(week)"
          >
            {{ week }}주차
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <!-- 출석/결석 현황 다이얼로그 -->
    <v-dialog v-model="dialog" max-width="900px">
      <v-card>
        <v-card-title class="headline">{{ selectedWeek }}주차 출석 현황</v-card-title>
        <v-card-text>
          <p><strong>전체 인원:</strong> {{ totalCount }}명</p>
          <p><strong>출석한 인원:</strong> {{ presentCount }}명</p>
          <p><strong>결석한 인원:</strong> {{ absentCount }}명</p>
          <v-divider class="my-2"></v-divider>

          <!-- ✅ members 데이터가 있을 때만 테이블 렌더링 -->
          <v-data-table
            v-if="members.length > 0"
            :headers="tableHeaders"
            :items="members"
            class="elevation-1"
            dense
          >
            <template #item.attendance="{ item }">
              <v-icon :color="item.attendance ? 'green' : 'red'">
                {{ item.attendance ? 'mdi-check-circle' : 'mdi-close-circle' }}
              </v-icon>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-btn color="grey" @click="dialog = false">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  name: "AttendancePage",
  data() {
    return {
      selectedWeek: 1,
      dialog: false,
      weekAttendanceData: {},
      tableHeaders: [
        { text: '학과', value: 'department' },
        { text: '학번', value: 'studentId' },
        { text: '학년', value: 'grade' },
        { text: '이름', value: 'name' },
        { text: '출석 여부', value: 'attendance' },
      ],
      clubId: 1  // TODO: 실제 동아리 ID로 바꾸기
    };
  },
  computed: {
    members() {
      const data = this.weekAttendanceData[this.selectedWeek];
      return Array.isArray(data) ? data : [];
    },
    presentMembers() {
      return this.members.filter(member => member.attendance);
    },
    absentMembers() {
      return this.members.filter(member => !member.attendance);
    },
    presentCount() {
      return this.presentMembers.length;
    },
    absentCount() {
      return this.absentMembers.length;
    },
    totalCount() {
      return this.members.length;
    }
  },
  methods: {
    async viewWeekAttendance(week) {
      this.selectedWeek = week;
      try {
        const response = await axios.get(`http://localhost:5000/api/attendance/list`, {
          params: {
            club_id: this.clubId,
            week: week
          },
          withCredentials: true  // 세션 기반 인증 시 필수
        });
        // 백엔드에서 받아온 출석자만 표시되므로, 출석 여부가 없는 인원은 결석 처리 필요
        const members = await this.fetchClubMembers(this.clubId);
        const attendanceRecords = response.data.attendance;
        const enrichedMembers = members.map(member => {
          const attended = attendanceRecords.find(r => r.user_id === member.id);
          return {
            id: member.id,
            name: member.name,
            department: member.department,
            studentId: member.student_id,
            grade: member.grade,
            attendance: !!attended
          };
        });
        this.weekAttendanceData[week] = enrichedMembers;
        this.dialog = true;
      } catch (err) {
        console.error("❗ 출석 데이터 로드 실패:", err);
        alert("출석 정보를 불러오지 못했습니다.");
      }
    },
    async fetchClubMembers(clubId) {
      try {
        const res = await axios.get(`http://localhost:5000/api/clubs/${clubId}/members`, {
          withCredentials: true
        });
        return res.data;
      } catch (err) {
        console.error("❗ 멤버 목록 조회 실패:", err);
        return [];
      }
    }
  }
};
</script>

<style scoped>
.mt-16 {
  margin-top: 130px;
}
</style>
