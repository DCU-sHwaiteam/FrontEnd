<template>
  <v-container>
    <h1>출석체크 페이지</h1>

    <!-- 플러스 아이콘 (우측 상단 고정) -->
    <v-btn icon color="primary" @click="showAttendanceDialog = true" class="add-attendance-btn">
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <!-- 출석 체크 팝업 -->
    <v-dialog v-model="showAttendanceDialog" max-width="500px">
      <v-card>
        <v-card-title>출석 체크 설정</v-card-title>
        <v-card-text>
          <v-form>
            <!-- 날짜 선택 -->
            <v-menu
              ref="dateMenu"
              v-model="dateMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="attendanceDate"
                  label="출석 날짜"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="attendanceDate" @input="dateMenu = false"></v-date-picker>
            </v-menu>

            <!-- 시작 시간 선택 -->
            <v-text-field
              v-model="startTime"
              label="시작 시간"
              type="time"
              prepend-icon="mdi-clock-start"
            ></v-text-field>

            <!-- 종료 시간 선택 -->
            <v-text-field
              v-model="endTime"
              label="종료 시간"
              type="time"
              prepend-icon="mdi-clock-end"
            ></v-text-field>

            <!-- 출석 방식 선택 -->
            <v-select
              v-model="attendanceType"
              :items="attendanceTypes"
              label="출석 방식"
              prepend-icon="mdi-check"
            ></v-select>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-btn text color="red" @click="showAttendanceDialog = false">취소</v-btn>
          <v-btn text color="green" @click="saveAttendanceSettings">저장</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 생성된 출석 체크 리스트 -->
    <v-row>
      <v-col
        v-for="(attendance, index) in attendanceList"
        :key="index"
        cols="12"
        md="12"
      >
        <v-card class="pa-3 attendance-card">
          <v-card-title>
            <div>출석 날짜: {{ attendance.date }}</div>
            <div>시간: {{ attendance.startTime }} ~ {{ attendance.endTime }}</div>
            <div>방식: {{ attendance.type }}</div>
          </v-card-title>
          <v-card-actions>
            <!-- 출석 버튼 (출석 방식이 PIN일 때만) -->
            <v-btn
              v-if="attendance.type === 'PIN'"
              color="primary"
              @click="checkAttendance(index)"
              class="ml-auto attendance-btn"
            >
              출석
            </v-btn>

            <!-- 핀 번호 생성 버튼 (출석 방식이 PIN일 때만) -->
            <v-btn
              v-if="attendance.type === 'PIN'"
              icon
              color="secondary"
              @click="generatePin(index)"
              class="ml-2 pin-btn"
            >
              <v-icon>mdi-key-plus</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import dayjs from "dayjs";

export default {
  data() {
    return {
      showAttendanceDialog: false,
      dateMenu: false,
      attendanceDate: dayjs().format("YYYY-MM-DD"),
      startTime: "",
      endTime: "",
      attendanceType: "",
      attendanceTypes: ["PIN", "QR", "와이파이"],
      attendanceList: [],
    };
  },
  methods: {
    saveAttendanceSettings() {
      this.attendanceList.push({
        date: this.attendanceDate || dayjs().format("YYYY-MM-DD"),
        startTime: this.startTime || "00:00",
        endTime: this.endTime || "23:59",
        type: this.attendanceType || "미지정",
        pin: null,
      });
      this.resetDialog();
      this.showAttendanceDialog = false;
    },
    resetDialog() {
      this.attendanceDate = dayjs().format("YYYY-MM-DD");
      this.startTime = "";
      this.endTime = "";
      this.attendanceType = "";
    },
    generatePin(index) {
      const newPin = Math.floor(1000 + Math.random() * 9000); // 1000~9999
      this.attendanceList[index].pin = newPin;
      alert(`새로운 PIN이 생성되었습니다: ${newPin}`);
    },
    checkAttendance(index) {
      const userPin = prompt("PIN 번호를 입력하세요:");
      if (userPin === this.attendanceList[index].pin?.toString()) {
        alert("출석 완료!");
      } else {
        alert("PIN 번호가 틀렸습니다.");
      }
    },
  },
};
</script>

<style scoped>
.add-attendance-btn {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 10;
}

/* 출석 체크 카드 스타일 */
.attendance-card {
  width: 100%;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-bottom: 16px;
}

.attendance-btn {
  margin-left: auto;
}

.pin-btn {
  margin-left: 8px;
}
</style>



  
  
  
  
