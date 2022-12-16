<template>
  <div class="aside-top-component">
    <div class="subtitle">The trend of the current song</div>
    <div class="aside-top-svg"></div>
  </div>
</template>

<script>
import * as d3 from "d3";
import { mapGetters } from "vuex";
import genreCountryJson from "@/assets/genreCountryJson_100.json";

export default {
  name: "AsideTopComponent",
  data() {
    return {
      width: 400,
      height: 320,
      margin: { top: 10, right: 10, bottom: 20, left: 14 },
      data: [],
      xScale: null,
      yScale: null,
      xAxis: null,
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
    };
  },
  computed: {
    ...mapGetters(["dateRange", "selectedSong", "selectedGenre"]),
  },
  created() {
    // this.filterData("hip hop", [
    //   this.parseTime("2017/12/31"),
    //   this.parseTime("2021/12/30"),
    // ]);
  },
  mounted() {
    this.drawSVG();
  },
  methods: {
    drawSVG() {
      var svg = d3
        .select(".aside-top-svg")
        .append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .style("margin-top", "40px")
        .append("g")
        .attr(
          "transform",
          "translate(" + this.margin.left + "," + this.margin.top + ")"
        );

      this.xScale = d3
        .scaleTime()
        .domain(this.dateRange)
        .range([this.margin.left, this.width]);

      this.yScale = d3
        .scaleLinear()
        .domain([100, 0])
        .range([this.height, this.margin.top]);

      this.xAxis = svg
        .append("g")
        .attr("transform", "translate(0," + this.height + ")")
        .attr("color", "#fff")
        .call(d3.axisBottom(this.xScale).ticks(8));

      svg
        .append("g")
        .attr("transform", `translate(${this.margin.left},0)`)
        .attr("color", "#fff")
        .call(d3.axisLeft(this.yScale).ticks(10))
        .call((g) => g.select(".domain").remove())

        .call((g) =>
          g
            .selectAll(".tick:not(:first-of-type) line")
            .attr("stroke-opacity", 0.1)
            .attr("stroke-dasharray", "2,2")
            .attr("x2", this.width - this.margin.left)
        )
        .call((g) =>
          g.selectAll(".tick:first-of-type line").attr("stroke-opacity", 0)
        )
        .call((g) =>
          g
            .append("text")
            .attr("x", -this.margin.left * 1.5)
            .attr("y", 0)
            .attr("fill", "#fff")
            .attr("text-anchor", "start")
            .text("Position")
        );
    },
    updateSVG() {
      var svg = d3.select(".aside-top-svg svg g");
      d3.select("g#line-chart").remove();

      this.xScale.domain(d3.extent(this.data, (d) => this.parseTime(d.date)));
      this.xAxis.call(d3.axisBottom(this.xScale).ticks(6));

      var line = d3
        .line()
        .x((d) => this.xScale(this.parseTime(d.date)))
        .y((d) => this.yScale(+d.position));

      svg
        .append("g")
        .attr("id", "line-chart")
        .selectAll("path")
        .data(d3.group(this.data, (d) => d.country))
        .join("path")
        .style("fill", "none")
        .style("stroke", ([, d]) => this.colors[d[0].continent])
        .style("stroke-linejoin", "round")
        .style("stroke-linecap", "round")
        .style("stroke-width", 1.5)
        .style("stroke-opacity", 0.8)

        .attr("d", ([, I]) => line(I));
    },
    filterData(genre, dateRange) {
      this.data = genreCountryJson[genre].filter(
        (d) =>
          d.name == this.selectedSong.name &&
          this.parseTime(d.date) > dateRange[0] &&
          this.parseTime(d.date) < dateRange[1]
      );
    },
    parseTime(string) {
      return d3.timeParse("%Y/%m/%d")(string);
    },
  },
  watch: {
    selectedSong() {
      this.filterData(this.selectedGenre, this.dateRange);
    },
    dateRange(newV) {
      this.filterData(this.selectedGenre, newV);
    },
    data() {
      console.log(this.data);
      this.updateSVG();
    },
  },
};
</script>

<style scoped>
.aside-top-component {
  height: 100%;
  width: 100%;
  border: 1px solid #999999;
  border-radius: 0.6em;
  background-color: #171717;
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
