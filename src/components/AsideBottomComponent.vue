<template>
  <div class="aside-bottom-component">
    <div class="subtitle">The trend in each country</div>
    <div class="sort">
      <span>Sorted by</span>
      <div class="my-2 text-sm">
        <el-radio-group v-model="radioValue" class="ml-4">
          <el-radio label="1" size="small">
            <span>the tototal number in each country</span>
          </el-radio>
          <el-radio label="2" size="small">
            <span>the each continent</span>
          </el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="aside-bottom-svg"></div>
  </div>
</template>

<script>
import genreCountryJson from "@/assets/genreCountryJson_100.json";
import { mapGetters } from "vuex";
import * as d3 from "d3";

export default {
  name: "ASideBottomComponent",
  data() {
    return {
      radioValue: "1",
      width: 380,
      height: 380,
      margin: { top: 5, right: 10, bottom: 10, left: 10 },
      data: [],
      colors: {
        World: "#546469",
        Asia: "#6348FF",
        Europe: "#93ED42",
        "North America": "#EEC934",
        "South America": "#D38FE4",
        Africa: "#2ADCF7",
        Oceania: "#96965e",
        Antarctica: "#E22693",
      },
      xScale: null,
      yScale: null,
      innerRadius: 90,
      outerRadius: 100,
    };
  },
  computed: {
    ...mapGetters(["dateRange", "selectedSong", "selectedGenre"]),
  },
  created() {
    this.filterData("hip hop", [
      this.parseTime("2015/1/1"),
      this.parseTime("2022/12/30"),
    ]);
    this.outerRadius = Math.min(this.width, this.height) - 90;
  },
  mounted() {
    this.drawSVG();
  },
  methods: {
    drawSVG() {
      const svg = d3
        .select(".aside-bottom-svg")
        .append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .style("margin-top", "-48px")
        .append("g")
        .attr(
          "transform",
          "translate(" + this.width / 2 + "," + this.height / 1.5 + ")"
        );

      this.xScale = d3
        .scaleBand()
        .range([Math.PI / 6, 2 * Math.PI])
        .align(0)
        .domain(this.data.map((d) => d.country));
      this.yScale = d3
        .scaleLinear()
        .range([this.innerRadius, this.outerRadius])
        .domain([0, 10000]);

      var yAxis = (g) =>
        g.call((g) =>
          g
            .selectAll("g")
            .data(this.yScale.ticks(5))
            .join("g")
            .attr("fill", "none")
            .call((g) =>
              g
                .append("circle")
                .attr("stroke", "#313131")
                .attr("stroke-opacity", 0.8)
                .attr("r", this.yScale)
            )
        );

      svg.append("g").call(yAxis);

      var labels = Object.keys(this.colors);
      var legend = (g) =>
        g
          .append("g")
          .selectAll("g")
          .data(labels)
          .join("g")
          .attr(
            "transform",
            (d, i) => `translate(-20,${(i - labels.length / 2) * 12})`
          )
          .call((g) =>
            g
              .append("rect")
              .attr("width", 8)
              .attr("height", 8)
              .attr("fill", (d) => this.colors[d])
          )
          .call((g) =>
            g
              .append("text")
              .attr("x", 12)
              .attr("y", 6)
              .attr("dy", "0.2em")
              .style("fill", "#fff")
              .style("font-size", "8px")
              .text((d) => d)
          );

      svg.append("g").call(legend);

      svg
        .append("g")
        .attr("id", "bar")
        .selectAll("path")
        .data(this.data)
        .enter()
        .append("path")
        .attr("fill", (d) => this.colors[d.continent])
        .attr(
          "d",
          d3
            .arc()
            .innerRadius(this.innerRadius)
            .outerRadius((d) => this.yScale(d.number))
            .startAngle((d) => this.xScale(d.country))
            .endAngle((d) => this.xScale(d.country) + this.xScale.bandwidth())
            .padAngle(0.03)
            .padRadius(this.innerRadius)
        );
    },
    updateSVG() {
      var svg = d3.select(".aside-bottom-svg svg g");
      d3.select("g#bar").remove();

      this.xScale.domain(this.data.map((d) => d.country));

      svg
        .append("g")
        .attr("id", "bar")
        .selectAll("path")
        .data(this.data)
        .enter()
        .append("path")
        .attr("fill", (d) => this.colors[d.continent])
        .attr(
          "d",
          d3
            .arc()
            .innerRadius(this.innerRadius)
            .outerRadius((d) => this.yScale(d.number))
            .startAngle((d) => this.xScale(d.country))
            .endAngle((d) => this.xScale(d.country) + this.xScale.bandwidth())
            .padAngle(0.03)
            .padRadius(this.innerRadius)
        );
    },
    updateSVGType() {},
    parseTime(string) {
      return d3.timeParse("%Y/%m/%d")(string);
    },
    filterData(genre, dateRange) {
      var filterData = genreCountryJson[genre].filter(
        (d) =>
          this.parseTime(d.date) > dateRange[0] &&
          this.parseTime(d.date) < dateRange[1]
      );
      this.data = Array.from(
        d3.group(filterData, (d) => d.country),
        ([key, value]) => ({
          country: key,
          number: value.length,
          continent: value[0].continent,
        })
      );
      this.data = d3.sort(this.data, (a, b) =>
        d3.descending(a.number, b.number)
      );
    },
    sortData() {
      if (this.radioValue === "1") {
        this.data = d3.sort(this.data, (a, b) =>
          d3.descending(a.number, b.number)
        );
      } else {
        this.data = d3.sort(this.data, (d) => Object.keys(this.colors).indexOf(d.continent));
      }
    },
  },
  watch: {
    selectedSong(newV) {
      this.filterData(newV.genre, this.dateRange);
    },
    dateRange(newV) {
      this.filterData(this.selectedGenre, newV);
    },
    data() {
      this.sortData();
      if (this.xScale) this.updateSVG();
    },
    radioValue() {
      this.sortData();
    },
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
