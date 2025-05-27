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
        <v-card-title class="headline"
          >{{ selectedWeek }}주차 출석 현황</v-card-title
        >
        <v-card-text>
          <p><strong>전체 인원:</strong> {{ totalCount }}명</p>
          <p><strong>출석한 인원:</strong> {{ presentCount }}명</p>
          <p><strong>결석한 인원:</strong> {{ absentCount }}명</p>
          <v-divider class="my-2"></v-divider>

          <v-data-table
            v-if="members.length > 0"
            :headers="tableHeaders"
            :items="members"
            class="elevation-1"
            dense
            item-value="id"
            hide-default-footer
          >
            <template #item="{ item }">
              <tr>
                <td>{{ item.department }}</td>
                <td>{{ item.studentId }}</td>
                <td>{{ item.grade }}</td>
                <td>{{ item.name }}</td>
                <td>
                  <v-icon :color="item.attendance ? 'green' : 'red'">
                    {{
                      item.attendance ? "mdi-check-circle" : "mdi-close-circle"
                    }}
                  </v-icon>
                </td>
              </tr>
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
import {
  fetchAttendanceRecords,
  fetchClubMembers,
} from "@/services/authService";

export default {
  name: "AttendancePage",
  props: {
    id: {
      // 라우트 파라미터로 받은 clubId
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
        { text: "학과", value: "department" },
        { text: "학번", value: "studentId" },
        { text: "학년", value: "grade" },
        { text: "이름", value: "name" },
        { text: "출석 여부", value: "attendance" },
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

        // ✅ 출석 여부를 status 필드로 확인
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
.mt-16 {
  margin-top: 130px;
}
</style>
