<template>
  <div class="aside-bottom-component">
    <div class="subtitle">The trend in each country</div>
    <div class="sort">
      <span>Sorted by</span>
      <div class="my-2 text-sm">
        <el-radio-group v-model="radioValue" class="ml-4">
          <el-radio label="1" size="small"
            ><span>the tototal number in each country</span></el-radio
          >
          <el-radio label="2" size="small"
            ><span>the each continent</span></el-radio
          >
        </el-radio-group>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ASideBottomComponent",
  data() {
    return {
      radioValue: "1",
    };
  },
};
</script>

<style scoped>
.aside-bottom-component {
  height: 100%;
  width: 100%;
  border: 1px solid #999999;
  border-radius: 0.6em;
}
.subtitle {
  text-align: left;
  margin-left: 14px;
  margin-top: 14px;

  font-family: "DM Sans";
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 31px;
  letter-spacing: -0.05em;

  color: #ffffff;
}
.sort {
  text-align: left;
  margin-left: 14px;
  margin-top: 14px;
  width: max-content;

  font-family: "JejuGothic";
  font-style: normal;
  font-weight: 400;
  font-size: 8px;
  line-height: 9px;
  color: #ffffff;

  display: flex;
}
.my-2[data-v-654d642c] {
  margin-top: -8px;
  margin-left: 10px;
  font-size: 8px;
}
.el-radio-group {
  display: inline-flex;
  align-items: flex-start;
  flex-wrap: nowrap;
  font-size: 0;
  flex-direction: column;
}
.el-radio.el-radio--small .el-radio__label {
  font-size: 8px;
}
</style>
