<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <el-container style="height:100%">
      <el-header style="height:8%"><h1>Spotify Visualization</h1></el-header>
      <el-container style="height:90%">
        <el-aside width="30%" style="height:100%">
          <div style="height:calc(50% - 16px);padding:6px">
            <div style="height:100%" class="graph"></div>
          </div>
          <div style="height:calc(50% - 16px);padding:6px">
            <div style="height:100%" class="map"></div>
          </div>
        </el-aside>
        <el-main style="padding-left:6px; padding-right:8px; padding-top:6px; padding-bottom:14px">
          <div style="height:100%">
            <div style="height:100%" class="radical"></div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "HomeView",
  components: {
    // HelloWorld,
  },
};
</script>

<style scoped>
.el-header {
  position: relative;
  background-color: #2c2f3b;
  color: #fff; 
  justify-content: center;
  display: flex;
  align-items: center;
}
.home {
  height: 100%;
}
.graph, .map, .radical {
  border: #9aa7b1 0.15em solid;
  border-radius: 0.6em;
}
</style>
