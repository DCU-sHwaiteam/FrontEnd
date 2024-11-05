<template>
  <v-app class="MainPage">
    <v-app-bar app color="black" dark>
      <v-toolbar-title>DCU 동아리</v-toolbar-title>
      <v-container>
        <v-row justify="space-around">
          <v-btn @click="navigateTo('myClub')" color="primary">내 동아리</v-btn>
          <v-btn @click="navigateTo('clubSearch')" color="primary">동아리 검색</v-btn>
        </v-row>
      </v-container>
    </v-app-bar>
    <v-divider color="gray" />
  </v-app>
</template>

<script>
export default {
  methods: {
    navigateTo(routeName) {
      this.$router.push({ name: routeName });
    }
  }
}
</script>

<style scoped>
.v-app-bar {
  border-bottom: 2px solid gray; /* 헤더 경계선 */
}
</style>
