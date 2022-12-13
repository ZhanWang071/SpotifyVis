<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <el-container style="height: 100%">
      <el-header style="height: 70px"
        ><span class="title"
          >Spotify - Visualization of Genre Trends</span
        ></el-header
      >
      <el-container>
        <el-main style="padding-left: 40px; padding-top: 6px; height: 954px">
          <div style="height: 100%">
            <spiral-component />
          </div>
        </el-main>
        <el-aside width="26%" style="height: 100%">
          <div style="height: 460px; padding-top: 6px; padding-right: 40px">
            <graph-component />
          </div>
          <div style="height: 460px; padding-top: 8px; padding-right: 40px">
            <map-component />
          </div>
        </el-aside>
      </el-container>
      <el-footer height="50px">
        <img
          style="position: absolute; left: 27px; top: 1038px"
          alt="Vue logo"
          src="../assets/Spotify_logo.png"
        />
        <span class="dataSource"
          >Credit to:
          https://www.kaggle.com/datasets/jfreyberg/spotify-chart-data</span
        >
        <img
          style="position: absolute; right: 40px; top: 1025px"
          alt="Vue logo"
          src="../assets/thumbnail_Outlook-bapckxvn.png"
        />
        <span class="footer">Spotify - Visualization of Genre Trends</span>
      </el-footer>
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
  /* background-color: #2c2f3b; */
  color: #fff;
  justify-content: center;
  display: flex;
  align-items: center;
}
.home {
  height: 1080px;
  background-color: #171717;
}
.title {
  position: absolute;
  /* width: 608px; */
  height: 47px;
  /* left: 602px; */
  top: 17px;

  font-family: "DM Sans";
  font-style: normal;
  font-weight: 700;
  font-size: 30px;
  line-height: 47px;
  /* identical to box height */

  letter-spacing: -0.05em;

  color: #ffffff;
}
.dataSource {
  position: absolute;
  /* width: 443px; */
  height: 15px;
  left: 150px;
  top: 1046px;

  font-family: "JejuGothic";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 13px;
  display: flex;
  align-items: center;
  text-align: center;

  color: rgba(255, 255, 255, 0.3);
}
.footer {
  position: absolute;
  /* width: 239px; */
  height: 15px;
  left: 1476px;
  top: 1046px;

  font-family: "JejuGothic";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 13px;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: -0.05em;

  color: rgba(255, 255, 255, 0.3);
}
</style>
