<template>
  <v-app class="attendance-page">
    <!-- 상단 바 -->
    <v-app-bar
      flat
      color="#aee3fa"
      height="70"
      style="box-shadow:none;"
      class="main-app-bar"
    >
      <v-container class="d-flex align-center justify-space-between" style="height:100%;">
        <div class="d-flex align-center">
          <v-img
            src="/static/images/logo.png"
            alt="체크인클럽"
            contain
            max-height="32"
            max-width="32"
            class="mr-2"
          />
          <span class="font-weight-bold" style="font-size: 1.3rem; color: #222;">체크인클럽</span>
        </div>
        <div class="d-flex align-center">
          <v-btn text class="top-link" @click="$router.push({name: 'home'})">내정보</v-btn>
          <v-btn text class="top-link" @click="$router.push({name: 'login'})">로그아웃</v-btn>
        </div>
      </v-container>
    </v-app-bar>

    <!-- 주차별 출석 버튼 -->
    <v-container class="attendance-container">
      <div class="attendance-title">출석 관리</div>
      <v-row class="week-buttons">
        <v-col
          v-for="week in 16"
          :key="week"
          cols="3"
          md="2"
          class="d-flex justify-center"
        >
          <v-btn
            class="week-btn"
            @click="viewWeekAttendance(week)"
          >
            {{ week }}주차
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <!-- 출석 현황 다이얼로그 -->
    <v-dialog v-model="dialog" max-width="900px" content-class="attendance-dialog">
      <v-card class="attendance-card">
        <v-card-title class="dialog-title">
          {{ selectedWeek }}주차 출석 현황
        </v-card-title>
        <v-card-text>
          <div class="stats-row">
            <div class="stat-item">
              <div class="stat-label">전체 인원</div>
              <div class="stat-value">{{ totalCount }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">출석</div>
              <div class="stat-value present">{{ presentCount }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">결석</div>
              <div class="stat-value absent">{{ absentCount }}</div>
            </div>
          </div>
          
          <v-data-table
            v-if="members.length > 0"
            :headers="tableHeaders"
            :items="members"
            class="attendance-table"
            dense
            hide-default-footer
          >
            <template #item="{ item }">
              <tr :class="item.attendance ? 'present-row' : 'absent-row'">
                <td>{{ item.department }}</td>
                <td>{{ item.studentId }}</td>
                <td>{{ item.grade }}</td>
                <td>{{ item.name }}</td>
                <td class="text-center">
                  <v-icon :color="item.attendance ? '#4CAF50' : '#F44336'">
                    {{ item.attendance ? "mdi-check-circle" : "mdi-close-circle" }}
                  </v-icon>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-btn color="#828191" class="white--text" @click="dialog = false">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import {
  fetchAttendanceRecords,
  fetchClubMembers,
} from "@/services/authService";

export default {
  name: "AttendancePage",
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      selectedWeek: 1,
      dialog: false,
      weekAttendanceData: {},
      tableHeaders: [
        { text: "학과", value: "department", width: "25%" },
        { text: "학번", value: "studentId", width: "20%" },
        { text: "학년", value: "grade", width: "15%" },
        { text: "이름", value: "name", width: "20%" },
        { text: "출석 여부", value: "attendance", align: 'center', width: "20%" },
      ],
      clubId: this.id,
    };
  },
  computed: {
    members() {
      const data = this.weekAttendanceData[this.selectedWeek];
      return Array.isArray(data) ? data : [];
    },
    presentMembers() {
      return this.members.filter((member) => member.attendance);
    },
    absentMembers() {
      return this.members.filter((member) => !member.attendance);
    },
    presentCount() {
      return this.presentMembers.length;
    },
    absentCount() {
      return this.absentMembers.length;
    },
    totalCount() {
      return this.members.length;
    },
  },
  methods: {
    async viewWeekAttendance(week) {
      this.selectedWeek = week;
      try {
        const [members, attendanceRecords] = await Promise.all([
          fetchClubMembers(this.clubId),
          fetchAttendanceRecords(this.clubId, week),
        ]);

        const enrichedMembers = members.map((member) => {
          const record = attendanceRecords.find((r) => r.user_id === member.id);
          return {
            ...member,
            attendance: record ? record.status === "출석" : false,
          };
        });

        this.weekAttendanceData[week] = enrichedMembers;
        this.dialog = true;
      } catch (err) {
        console.error("데이터 로드 실패:", err);
        alert("정보를 불러오지 못했습니다.");
      }
    },
  },
};
</script>

<style scoped>
.attendance-page {
  background: #fff;
}

.main-app-bar {
  background-color: #aee3fa !important;
}

.top-link {
  color: #222 !important;
  font-weight: 500;
  font-size: 1rem;
  margin-left: 24px;
}

.attendance-container {
  max-width: 1200px;
  margin: 100px auto 0;
  padding: 0 16px;
}

.attendance-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #222;
  text-align: center;
  margin-bottom: 32px;
}

.week-buttons {
  margin-top: 24px;
}

.week-btn {
  background: #b8b4e3 !important;
  color: #fff !important;
  font-weight: 500;
  width: 100%;
  min-width: 80px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  transition: all 0.2s;
}

.week-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.attendance-card {
  border-radius: 20px !important;
  padding: 32px;
}

.dialog-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #222;
  text-align: center;
  margin-bottom: 24px;
}

.stats-row {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 32px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 1rem;
  color: #666;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: bold;
}

.present { color: #4CAF50; }
.absent { color: #F44336; }

.attendance-table {
  margin-top: 24px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.present-row {
  background: #f5fbf5 !important;
}

.absent-row {
  background: #fff5f5 !important;
}

.attendance-table >>> thead th {
  background: #f8f9fa !important;
  font-weight: 600 !important;
  color: #222 !important;
}

.attendance-table >>> tbody td {
  font-size: 0.95rem;
}
</style>
