// ✅ AttendancePage.vue
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
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title class="headline">{{ selectedWeek }}주차 출석 현황</v-card-title>
        <v-card-text>
          <p>출석한 인원: {{ presentCount }}명</p>
          <p>결석한 인원: {{ absentCount }}명</p>
          <v-divider class="my-2"></v-divider>
          <div>
            <strong>출석 인원:</strong>
            <ul>
              <li v-for="member in presentMembers" :key="'present-' + member.id">{{ member.name }}</li>
            </ul>
          </div>
          <div>
            <strong>결석 인원:</strong>
            <ul>
              <li v-for="member in absentMembers" :key="'absent-' + member.id">{{ member.name }}</li>
            </ul>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="grey" @click="dialog = false">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
export default {
  name: "AttendancePage",
  data() {
    return {
      selectedWeek: 1,
      dialog: false,
      weekAttendanceData: {},
    };
  },
  computed: {
    members() {
      return this.weekAttendanceData[this.selectedWeek] || [];
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
    }
  },
  methods: {
    viewWeekAttendance(week) {
      this.selectedWeek = week;
      const stored = localStorage.getItem("attendanceData");
      if (stored) {
        this.weekAttendanceData = JSON.parse(stored);
      }
      this.dialog = true;
    }
  }
};
</script>

<style scoped>
.mt-16 {
  margin-top: 130px;
}
</style>
