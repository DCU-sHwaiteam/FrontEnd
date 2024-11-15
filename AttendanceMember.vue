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

            <!-- 출석 방식 선택 -->
            <v-select
              v-model="attendanceType"
              :items="attendanceTypes"
              label="출석 방식"
              prepend-icon="mdi-check"
            ></v-select>

            <!-- 출석 가능 시간 선택 -->
            <v-select
              v-model="attendanceDuration"
              :items="['10', '20', '30', '40']"
              label="출석 시간 (분)"
              prepend-icon="mdi-clock-outline"
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
        md="6"
      >
        <v-card class="pa-3" style="height: 200px;">
          <v-card-title>
            <div>출석 날짜: {{ attendance.date }}</div>
            <div>시간: {{ formatTime(attendance.startTime) }} ~ {{ formatTime(attendance.endTime) }}</div>
          </v-card-title>
          <v-card-subtitle>
            <div>방식: {{ attendance.type }}</div>
            <div>설정된 시간: {{ attendance.duration }}분</div>
          </v-card-subtitle>
          <v-card-actions>
            <!-- 출석 버튼 (출석 방식이 PIN일 때만) -->
            <v-btn
              v-if="attendance.type === 'PIN' && isAttendanceOpen(attendance)"
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
      attendanceDuration: "",  // 출석 시간 선택 (10분, 20분, 30분, 40분)
      attendanceType: "PIN",  // 출석 방식 기본값
      attendanceTypes: ["PIN", "QR", "와이파이"],  // 출석 방식 항목들
      attendanceList: [],
    };
  },
  methods: {
    saveAttendanceSettings() {
      // 출석 가능한 시간 설정
      const duration = this.attendanceDuration ? parseInt(this.attendanceDuration) : 10;
      const startTime = dayjs();  // 현재 시간
      const endTime = startTime.add(duration, 'minute');  // 종료 시간 계산

      this.attendanceList.push({
        date: this.attendanceDate || dayjs().format("YYYY-MM-DD"),
        startTime: startTime.format("HH:mm"),
        endTime: endTime.format("HH:mm"),
        type: this.attendanceType || "미지정",
        pin: null,
        duration: duration,  // 설정된 출석 가능 시간 (분)
        startTimestamp: startTime.toISOString(),
        endTimestamp: endTime.toISOString(),
      });

      this.resetDialog();
      this.showAttendanceDialog = false;
    },
    resetDialog() {
      this.attendanceDate = dayjs().format("YYYY-MM-DD");
      this.attendanceDuration = "";
      this.attendanceType = "PIN";
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
    isAttendanceOpen(attendance) {
      const currentTime = dayjs();
      const startTime = dayjs(attendance.startTimestamp);
      const endTime = dayjs(attendance.endTimestamp);
      if (currentTime.isAfter(endTime)) {
        alert("지각입니다!");
        return false; // 출석 시간이 지나면 출석할 수 없음
      }
      return currentTime.isAfter(startTime) && currentTime.isBefore(endTime);
    },
    formatTime(time) {
      return time ? time : "00:00";
    }
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

.ml-auto {
  margin-left: auto;
}

.pa-3 {
  padding: 16px;
}

.attendance-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
</style>
