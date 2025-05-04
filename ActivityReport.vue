<template>
    <v-container>
      <v-row>
        <v-col>
          <v-card>
            <v-card-title>동아리 활동 보고서</v-card-title>
            <v-card-subtitle>동아리 장: {{ club.leader_name }}</v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
  
      <v-row>
        <v-col v-for="activity in activities" :key="activity.id" cols="12" sm="6" md="4">
          <v-card>
            <v-card-title>{{ activity.date }}</v-card-title>
            <v-card-subtitle>활동 시간: {{ activity.hours }}시간</v-card-subtitle>
            <v-card-text>참여자: {{ activity.participants.join(', ') }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        club: {
          id: 1,
          name: '동아리 1',
          leader_name: '홍길동',
        },
        activities: [
          {
            id: 1,
            date: '2025-04-15',
            hours: 2, // 한 번의 활동에 대해 2시간
            participants: ['김학생', '이학생'],
          },
          {
            id: 2,
            date: '2025-04-22',
            hours: 2,
            participants: ['김학생'],
          },
        ],
      };
    },
  };
  </script>