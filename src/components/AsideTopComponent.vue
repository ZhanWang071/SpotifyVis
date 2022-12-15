<template>
  <div class="aside-top-component">
      <div class="subtitle">The trend of the current song</div>
  </div>
</template>

<script>
export default {
  name: "AsideTopComponent",
};
</script>

<style scoped>
.aside-top-component {
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
</style>
