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
              :items="['1','10', '20', '30', '40']"
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
            <v-row>
              <v-col cols="6">
                <div>방식: {{ attendance.type }}</div>
              </v-col>
              <v-col cols="1" class="text-right">
                <div>설정된 시간: {{ attendance.duration }}분</div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <div>출석 상태: {{ attendance.status || '결석' }}</div>
              </v-col>
            </v-row>
          </v-card-subtitle>
          <v-card-actions>
            <!-- 출석 버튼 -->
            <v-btn
              v-if="attendance.type === 'PIN' && isAttendanceOpen(attendance)"
              color="primary"
              @click="checkAttendance(index)"
              class="ml-auto attendance-btn"
            >
              출석
            </v-btn>

            <!-- 핀 번호 생성 버튼 -->
            <v-btn
              v-if="attendance.type === 'PIN'"
              icon
              color="secondary"
              @click="generatePin(index)"
              class="ml-2 pin-btn"
            >
              <v-icon>mdi-key-plus</v-icon>
            </v-btn>

            <!-- 출석 상태 버튼 -->
            <v-btn
              icon
              color="primary"
              @click="showAttendanceStatus = true"
              class="ml-2"
            >
              <v-icon>mdi-account-group</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- 출석 상태 팝업 -->
    <v-dialog v-model="showAttendanceStatus" max-width="500px">
      <v-card>
        <v-card-title>출석 상태</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item v-for="member in members" :key="member.id">
              <v-list-item-content>
                <v-list-item-title>{{ member.name }}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-icon color="green" v-if="member.isPresent">mdi-check-circle</v-icon>
                <v-icon color="red" v-else>mdi-close-circle</v-icon>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn text color="red" @click="showAttendanceStatus = false">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import dayjs from "dayjs";

export default {
  data() {
    return {
      showAttendanceDialog: false,
      showAttendanceStatus: false,
      dateMenu: false,
      attendanceDate: dayjs().format("YYYY-MM-DD"),
      attendanceDuration: "",
      attendanceType: "PIN",
      attendanceTypes: ["PIN", "QR", "와이파이"],
      attendanceList: [],
      members: [
        { id: "1", name: "회원1", isPresent: true },
        { id: "2", name: "회원2", isPresent: false },
        { id: "3", name: "회원3", isPresent: true },
      ],
    };
  },
  methods: {
    saveAttendanceSettings() {
      const duration = this.attendanceDuration ? parseInt(this.attendanceDuration) : 10;
      const startTime = dayjs();
      const endTime = startTime.add(duration, "minute");

      this.attendanceList.push({
        date: this.attendanceDate || dayjs().format("YYYY-MM-DD"),
        startTime: startTime.format("HH:mm"),
        endTime: endTime.format("HH:mm"),
        type: this.attendanceType || "미지정",
        pin: null,
        duration: duration,
        status: '결석', // 출석 상태를 기본 '결석'으로 설정
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
      const newPin = Math.floor(1000 + Math.random() * 9000);
      this.attendanceList[index].pin = newPin;
      alert(`새로운 PIN이 생성되었습니다: ${newPin}`);
    },
    checkAttendance(index) {
      const userPin = prompt("PIN 번호를 입력하세요:");

      // 출석 시간이 끝났는지 확인
      const currentTime = dayjs();
      const endTime = dayjs(this.attendanceList[index].endTimestamp);

      if (currentTime.isAfter(endTime)) {
        alert("지각입니다!");
        // 출석 상태를 지각으로 변경
        this.attendanceList[index].status = "지각";
      } else if (userPin === this.attendanceList[index].pin?.toString()) {
        alert("출석 완료!");
        // 출석 상태 업데이트
        this.attendanceList[index].status = '출석';
      } else {
        alert("PIN 번호가 틀렸습니다.");
      }
    },
    isAttendanceOpen(attendance) {
      const currentTime = dayjs();
      const startTime = dayjs(attendance.startTimestamp);
      const endTime = dayjs(attendance.endTimestamp);
      return currentTime.isAfter(startTime) && currentTime.isBefore(endTime);
    },
    formatTime(time) {
      return time ? time : "00:00";
    },
  },
};
</script>
