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
    };
  },
  computed: {
    members() {
      const data = this.weekAttendanceData[this.selectedWeek];
      const isValid = Array.isArray(data);
      if (!isValid) {
        console.warn("❗ members()에 유효하지 않은 데이터:", data);
      } else if (data.length > 0) {
        console.log("✅ 첫 번째 member의 키:", Object.keys(data[0]));
      }
      return isValid ? data : [];
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
    viewWeekAttendance(week) {
      this.selectedWeek = week;
      const stored = localStorage.getItem("attendanceData");
      if (stored) {
        const parsed = JSON.parse(stored);
        this.weekAttendanceData = parsed;
        this.validateAttendanceData(parsed[week]);

        console.log("✅ selectedWeek:", week);
        console.log("✅ members:", this.weekAttendanceData[week]);
      }

      this.$nextTick(() => {
        this.dialog = true;
      });
    },
    injectMockData() {
      const names = [
        "홍길동", "김철수", "이영희", "박민수", "최수정",
        "정예린", "오승현", "서준호", "장지우", "윤하진"
      ];
      const weekData = {};
      for (let week = 1; week <= 16; week++) {
        weekData[week] = names.map((name, index) => ({
          id: index + 1,
          name,
          department: "AI빅데이터공학과",
          studentId: "2011" + Math.floor(1000 + Math.random() * 9000),
          grade: 4,
          attendance: Math.random() < 0.7
        }));
      }
      localStorage.setItem("attendanceData", JSON.stringify(weekData));
    },
    validateAttendanceData(weekData) {
      if (!Array.isArray(weekData)) {
        console.warn("⚠ 유효하지 않은 weekData입니다:", weekData);
        return;
      }

      const requiredKeys = ['department', 'studentId', 'grade', 'name', 'attendance'];
      const invalid = weekData.filter(member =>
        requiredKeys.some(key => !(key in member))
      );

      if (invalid.length > 0) {
        console.warn("❗ 누락된 항목이 있는 데이터:", invalid);
      } else {
        console.log("✅ 모든 멤버 데이터 구조가 유효합니다.");
      }
    }
  },
  mounted() {
    // 항상 새로운 목업 데이터로 초기화
    localStorage.removeItem("attendanceData");
    this.injectMockData();
  }
};
</script>

<style scoped>
.mt-16 {
  margin-top: 130px;
}
</style>
