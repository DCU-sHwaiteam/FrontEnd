P<template>
    <v-app>
      <!-- 상단 바 -->
      <v-app-bar app color="black" dark>
        <v-container>
          <v-row align="center" justify="space-between">
            <v-col>
              <v-toolbar-title>동아리 출석 명부</v-toolbar-title>
            </v-col>
          </v-row>
        </v-container>
      </v-app-bar>
  
      <!-- 출석 명부 테이블 -->
      <v-container>
        <v-table :items="members" :headers="headers">
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.name }}</td>
              <td>{{ item.department }}</td>
              <td>{{ item.studentId }}</td>
              <td>{{ item.attendance ? "출석" : "결석" }}</td>
              <td>
                <!-- 출석 버튼 -->
                <v-btn @click="toggleAttendance(item)" color="primary">
                  {{ item.attendance ? "결석" : "출석" }}
                </v-btn>
              </td>
            </tr>
          </template>
        </v-table>
      </v-container>
  
      <!-- 출석 상태 확인 -->
      <v-container>
        <v-btn color="success" @click="viewAttendance">출석 상태 보기</v-btn>
      </v-container>
  
      <!-- 출석/결석 현황 -->
      <v-dialog v-model="dialog" max-width="600px">
        <v-card>
          <v-card-title class="headline">출석 현황</v-card-title>
          <v-card-text>
            <p>출석한 인원: {{ presentCount }}명</p>
            <p>결석한 인원: {{ absentCount }}명</p>
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
        // 출석 명부에 있는 동아리 구성원
        members: [
          { id: 1, name: "홍길동", department: "컴퓨터공학과", studentId: "2021001", attendance: false },
          { id: 2, name: "김철수", department: "기계공학과", studentId: "2021002", attendance: false },
          { id: 3, name: "이영희", department: "전자공학과", studentId: "2021003", attendance: false },
          // 추가 구성원들...
        ],
        headers: [
          { text: "이름", align: "start", key: "name" },
          { text: "학과", align: "start", key: "department" },
          { text: "학번", align: "start", key: "studentId" },
          { text: "출석 상태", align: "start", key: "attendance" },
          { text: "조치", align: "center" }
        ],
        dialog: false, // 출석 상태 보기 다이얼로그
      };
    },
    computed: {
      presentCount() {
        return this.members.filter(member => member.attendance).length;
      },
      absentCount() {
        return this.members.filter(member => !member.attendance).length;
      }
    },
    methods: {
      toggleAttendance(member) {
        // 출석 버튼 클릭 시 출석 상태 토글
        member.attendance = !member.attendance;
      },
      viewAttendance() {
        this.dialog = true;
      }
    }
  };
  </script>
  
  <style scoped>
  .search-container {
    margin-top: 100px;
  }
  
  .list-card {
    padding: 16px;
    margin-bottom: 16px;
    cursor: pointer;
    border-radius: 8px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease;
  }
  
  .list-card:hover {
    transform: translateY(-4px);
  }
  </style>