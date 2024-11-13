<template>
  <v-container>
    <h1>내 동아리</h1>
    <v-row>
      <v-col
        v-for="club in clubs"
        :key="club.id"
        cols="12" sm="6" md="4"
      >
        <v-card @click="navigateToClub(club.id)" class="club-card">
          <v-card-title>{{ club.name }}</v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      clubs: [
        { id: '1', name: '축구 동아리' },
        { id: '2', name: '음악 동아리' }
      ]
    };
  },
  methods: {
    navigateToClub(id) {
      this.$router.push({ name: 'ClubDetail', params: { id } });
    }
  }
};
</script>
