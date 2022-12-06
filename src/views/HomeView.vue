<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <el-container style="height: 100%">
      <el-header style="height: 8%"><h1>Spotify Visualization</h1></el-header>
      <el-container style="height: 90%">
        <el-aside width="30%" style="height: 100%">
          <div style="height: calc(50% - 16px); padding: 6px">
            <graph-component />
          </div>
          <div style="height: calc(50% - 16px); padding: 6px">
            <map-component />
          </div>
        </el-aside>
        <el-main
          style="
            padding-left: 6px;
            padding-right: 8px;
            padding-top: 6px;
            padding-bottom: 14px;
          "
        >
          <div style="height: 100%">
            <spiral-component />
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// @ is an alias to /src
import GraphComponent from "@/components/GraphComponent.vue";
import SpiralComponent from "@/components/SpiralComponent.vue";
import MapComponent from "@/components/MapComponent.vue";

export default {
  name: "HomeView",
  components: {
    GraphComponent,
    SpiralComponent,
    MapComponent,
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
</style>
