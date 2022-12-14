<template>
  <div class="main-component">
    <div>
      <span class="subtitle">The trend in each genre</span>
      <el-switch
        v-model="explicitValue"
        size="large"
        class="explicit-switch"
        style="margin-left: 24px"
        inline-prompt
        :active-icon="Check"
        :inactive-icon="Close"
        @change="switchChanged"
      />
      <span
        style="
          position: absolute;
          left: 456px;
          top: 98px;
          font-family: 'JejuGothic';
          font-style: normal;
          font-weight: 400;
          font-size: 8px;
          line-height: 9px;
          color: #ffffff;
        "
        >display explicit</span
      >
      <span
        style="
          position: absolute;
          left: 456px;
          top: 112px;

          font-family: 'JejuGothic';
          font-style: normal;
          font-weight: 400;
          font-size: 8px;
          line-height: 9px;
          opacity: 50%;
          color: #ffffff;
        "
        >(whether or not the track has content)</span
      >
    </div>
    <div class="main-svg">
      <div class="tooltip" style="position: absolute; text-align: left"></div>
    </div>
    <div class="date-slider">
      <el-slider
        v-model="dateSliderValue"
        range
        :marks="marks"
        @change="sliderChanged"
        :format-tooltip="formatTooltip"
      />
    </div>
  </div>
</template>

<script>
import songGlobalArray from "@/assets/songGlobalArray_100.json";
import genresOrderJson from "@/assets/genresOrderJson.json";
import * as d3 from "d3";
import { Check, Close } from "@element-plus/icons-vue";

export default {
  name: "MainComponent",
  data() {
    return {
      Check: Check,
      Close: Close,
      explicitValue: false,
      colors: [
        "#614858",
        "#864145",
        "#6a3a76",
        "#774855",
        "#603b46",
        "#515066",
        "#51565f",
        "#926839",
        "#978f3a",
        "#894b33",
        "#95793a",
        "#884538",
        "#517b7f",
        "#446fcc",
        "#59a666",
        "#4a779f",
        "#3f6789",
        "#5f7447",
        "#565b42",
        "#33338b",
        "#4d2b9a",
        "#3b4b95",
        "#3d3099",
        "#42588d",
        "#516a99",
        "#40147c",
        "#3a4999",
        "#484e79",
      ],
      dateSliderValue: [37.5, 87.5],
      dateRange: [],
      sliderScale: [],
      marks: {
        0: "2015",
        12.5: "2016",
        25: "2017",
        37.5: "2018",
        50: "2019",
        62.5: "2020",
        75: "2021",
        87.5: "2022",
        100: "2023",
      },
      xScale: null,
      xAxis: null,
      yScale: null,
      symbolEcks: null,
    };
  },
  created() {
    this.sliderScale = d3
      .scaleTime()
      .domain([this.parseTime("2015/1/1"), this.parseTime("2022/12/30")])
      .range([0, 100]);
    this.updateDateRage();
  },
  mounted() {
    // console.log(songGlobalArray.length);
    // console.log(genresOrderJson);

    this.drawSVG();
  },
  methods: {
    updateDateRage() {
      this.dateRange = [
        this.sliderScale.invert(this.dateSliderValue[0]),
        this.sliderScale.invert(this.dateSliderValue[1]),
      ];
    },
    parseTime(string) {
      return d3.timeParse("%Y/%m/%d")(string);
    },
    switchChanged(val) {
      if (val) {
        d3.selectAll(".bubbles-true").style("opacity", 0);
        d3.selectAll(".cross-true").style("opacity", 1);
      } else {
        d3.selectAll(".bubbles-true").style("opacity", 0.8);
        d3.selectAll(".cross-true").style("opacity", 0);
      }
    },
    formatTooltip(val) {
      var date = this.sliderScale.invert(val);
      return d3.timeFormat("%Y/%m/%d")(date);
    },
    sliderChanged() {
      this.updateDateRage();
      this.xScale.domain(this.dateRange);

      d3.select(".scatterplot-circles")
        .selectAll("circle")
        .attr("cx", (d) => this.xScale(this.parseTime(d.max_date)))
        .attr("display", (d) => {
          var cx = this.xScale(this.parseTime(d.max_date));
          return cx > 30 && cx < 1240 ? "block" : "none";
        });

      d3.selectAll("#cross")
        .attr("display", (d) => {
          var cx = this.xScale(this.parseTime(d.max_date));
          return cx > 30 && cx < 1240 ? "block" : "none";
        })
        .attr(
          "transform",
          (d) =>
            `translate(${this.xScale(
              this.parseTime(d.max_date)
            )}, ${this.yScale(this.circlePositionY(d))})`
        )
        .attr("d", (d) =>
          d3
            .symbol()
            .type(this.symbolEcks)
            .size(d.max_streams >= 3000000 ? 100 : 30)()
        );

      this.xAxis
        .call(d3.axisBottom(this.xScale))
        .call((g) => g.select(".domain").remove())
        .call((g) => {
          g.selectAll(".tick line")
            .attr("y2", -800)
            .attr("stroke-opacity", 0.1)
            .attr("stroke-dasharray", "2,2");
        });
    },
    drawSVG() {
      // set the dimensions and margins of the graph
      var margin = { top: 20, right: 60, bottom: 60, left: 40 },
        width = 1330 - margin.left - margin.right,
        height = 820 - margin.top - margin.bottom;

      // append the svg object to the body of the page
      var svg = d3
        .select(".main-svg")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      const classRange = [0, Object.keys(genresOrderJson).length + 1];

      // X axis
      this.xScale = d3
        .scaleTime()
        .domain(this.dateRange)
        .range([margin.left, width]);
      this.xAxis = svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("color", "#fff")
        .call(d3.axisBottom(this.xScale).ticks(8))
        .call((g) => g.select(".domain").remove())
        .call((g) =>
          g
            .selectAll(".tick line")
            .attr("y2", margin.top - height)
            .attr("stroke-opacity", 0.1)
            .attr("stroke-dasharray", "2,2")
        );

      // Y axis
      this.yScale = d3.scaleLinear().domain(classRange).range([height, 0]);
      svg
        .append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .attr("color", "#fff")
        .call(
          d3
            .axisLeft(this.yScale)
            .ticks(Object.keys(genresOrderJson).length)
            .tickFormat(this.formatTick)
        )
        .call((g) => g.select(".domain").remove())
        .call((g) =>
          g
            .selectAll(".tick:first-of-type line")
            .attr("stroke-opacity", 0.5)
            .attr("x2", width - margin.right / 4)
            .attr("transform", `translate(-16,0)`)
        )
        .call(
          (g) =>
            g
              .selectAll(".tick:not(:first-of-type) line")
              .attr("stroke-opacity", 0)
          // .attr("x2", width - margin.left / 2)
        )
        .call((g) =>
          g
            .selectAll(".tick text")
            .attr("font-family", "DM Sans")
            .attr("font-size", "12px")
            .attr("font-weight", "400")
            .attr("transform", "translate(-12,0)")
            .style("text-transform", "capitalize")
        );

      // add linear-gradient
      const defs = svg.append("defs");
      this.linearGradient(defs);

      // circles
      svg
        .append("g")
        .attr("class", "scatterplot-circles")
        .selectAll("dot")
        .data(songGlobalArray)
        .enter()
        .append("circle")
        .attr("class", (d) => "bubbles-" + d.explicit)
        .attr("id", (d) => "bubbles " + d.genre)
        .attr("cx", (d) => this.xScale(this.parseTime(d.max_date)))
        .attr("cy", (d) => this.yScale(this.circlePositionY(d)))
        .attr("display", (d) => {
          var cx = this.xScale(this.parseTime(d.max_date));
          return cx > 30 && cx < 1240 ? "block" : "none";
        })
        .attr("r", (d) => this.circleSize(d))
        .style("fill", (d) => this.circleFillColor(d))
        .style("stroke", (d) => this.borderColor(d))
        .style("opacity", "0.8")
        .on("mouseover", (_, d) => this.handleMouseover(_, d))
        .on("mousemove", (event) => this.handleMousemove(event))
        .on("mouseleave", this.handleMouseleave);

      // cross for explicit
      this.symbolEcks = {
        draw: (context, size) => {
          const root2 = Math.sqrt(2);
          const r = Math.sqrt(size / 5) / 2;
          const rRoot2 = r * root2;

          context.moveTo(rRoot2, rRoot2);
          context.lineTo(-1 * rRoot2, -1 * rRoot2);
          context.moveTo(-1 * rRoot2, rRoot2);
          context.lineTo(rRoot2, -1 * rRoot2);
        },
      };

      svg
        .append("g")
        .selectAll("cross")
        .data(songGlobalArray)
        .enter()
        .append("path")
        .attr("class", (d) => "cross-" + d.explicit)
        .attr("id", "cross")
        .attr("display", (d) => {
          var cx = this.xScale(this.parseTime(d.max_date));
          return cx > 30 && cx < 1240 ? "block" : "none";
        })
        .attr(
          "transform",
          (d) =>
            `translate(${this.xScale(
              this.parseTime(d.max_date)
            )}, ${this.yScale(this.circlePositionY(d))})`
        )
        .attr("d", (d) =>
          d3
            .symbol()
            .type(this.symbolEcks)
            .size(d.max_streams >= 3000000 ? 100 : 30)()
        )
        .attr("stroke", (d) => this.circleColor(d))
        .attr("opacity", 0);

      // circles for total number of each genre
      var genresCounter = [];
      for (var key in genresOrderJson) {
        genresCounter.push({
          genre: key,
          number: songGlobalArray.filter((d) => d.genre === key).length,
          index: Object.keys(genresOrderJson).length - genresOrderJson[key],
        });
      }

      const sizeRange = d3.extent(genresCounter, (d) => d.number);
      const sizeScale = d3.scaleLinear().domain(sizeRange).range([8, 16]);
      svg
        .append("g")
        .selectAll("dot")
        .data(genresCounter)
        .enter()
        .append("circle")
        .attr("class", (d) => "aside-bubbles-" + d.explicit)
        .attr("id", (d) => "aside-bubbles-" + d.genre)
        .attr("cx", width + margin.right / 2 + 5)
        .attr("cy", (d) => this.yScale(d.index))
        .attr("r", (d) => sizeScale(d.number))
        .style(
          "fill",
          (d) =>
            "url(#linear-gradient-" + genresOrderJson[d.genre].toString() + ")"
        )
        .style("stroke", "#171717")
        .style("opacity", "0.8");
      svg
        .append("g")
        .selectAll("dot")
        .data(genresCounter)
        .enter()
        .append("text")
        .text((d) => d.number)
        .attr("text-anchor", "middle")
        .attr("font-size", "8px")
        .attr("font-weight", "600")
        .style("fill", "white")
        .attr("dx", width + margin.right / 2 + 5)
        .attr("dy", (d) => this.yScale(d.index) + 3);
    },
    formatTick(d) {
      var num = parseInt(d);
      if (num === 0) return "";
      for (var key in genresOrderJson) {
        if (genresOrderJson[key] + num === Object.keys(genresOrderJson).length)
          return key;
      }
    },
    circlePositionY(d) {
      var y = Object.keys(genresOrderJson).length - genresOrderJson[d.genre];
      var heightScale = d3.scaleLinear().domain([0, 100]).range([0.5, -0.5]);
      y += heightScale(d.max_position);
      return y;
    },
    circleFillColor(d) {
      var genre_color = this.circleColor(d);
      if (d.max_streams >= 3000000) {
        return (
          "url(#linear-gradient-" + genresOrderJson[d.genre].toString() + ")"
        );
      } else {
        return genre_color;
      }
    },
    circleSize(d) {
      return d.max_streams >= 3000000 ? "6px" : "3px";
    },
    circleColor(d) {
      // return d.max_streams >= 3000000 ? this.colors[genresOrderJson[d.genre]] : "none";
      return this.colors[genresOrderJson[d.genre]];
    },
    borderColor(d) {
      // return d.max_streams < 3000000
      //   ? this.colors[genresOrderJson[d.genre]]
      //   : "transparent";
      return d.max_streams < 0 ? "transparent" : "#171717";
    },
    linearGradient(defs) {
      for (var g in genresOrderJson) {
        var linearGradient = defs
          .append("linearGradient")
          .attr("id", "linear-gradient-" + genresOrderJson[g].toString())
          .attr("transform", "rotate(60)");

        var color = this.colors[genresOrderJson[g]];

        linearGradient
          .append("stop")
          .attr("offset", "15%")
          .attr("stop-color", color);
        linearGradient
          .append("stop")
          .attr("offset", "15%")
          .attr("stop-color", "#171717");
        linearGradient
          .append("stop")
          .attr("offset", "25%")
          .attr("stop-color", "#171717");
        linearGradient
          .append("stop")
          .attr("offset", "25%")
          .attr("stop-color", color);
        linearGradient
          .append("stop")
          .attr("offset", "35%")
          .attr("stop-color", color);
        linearGradient
          .append("stop")
          .attr("offset", "35%")
          .attr("stop-color", "#171717");
        linearGradient
          .append("stop")
          .attr("offset", "45%")
          .attr("stop-color", "#171717");
        linearGradient
          .append("stop")
          .attr("offset", "45%")
          .attr("stop-color", color);
        linearGradient
          .append("stop")
          .attr("offset", "55%")
          .attr("stop-color", color);
        linearGradient
          .append("stop")
          .attr("offset", "55%")
          .attr("stop-color", "#171717");
        linearGradient
          .append("stop")
          .attr("offset", "65%")
          .attr("stop-color", "#171717");
        linearGradient
          .append("stop")
          .attr("offset", "65%")
          .attr("stop-color", color);
        linearGradient
          .append("stop")
          .attr("offset", "75%")
          .attr("stop-color", color);
        linearGradient
          .append("stop")
          .attr("offset", "75%")
          .attr("stop-color", "#171717");
        linearGradient
          .append("stop")
          .attr("offset", "85%")
          .attr("stop-color", "#171717");
        linearGradient
          .append("stop")
          .attr("offset", "85%")
          .attr("stop-color", color);
      }
    },
    handleMouseover(_, d) {
      d3.select(".tooltip")
        .style("display", "block")
        .html(
          "Name: " +
            d.name +
            "<br>Artists: " +
            d.artists +
            "<br>Genre: " +
            d.genre +
            "<br>Date: " +
            d.max_date +
            "<br>Position: " +
            d.max_position +
            "<br>Streams: " +
            d.max_streams
        );
    },
    handleMousemove(event) {
      const [mouseX, mouseY] = d3.pointer(event, this);
      const MOUSE_POS_OFFSET = 16;
      d3.select(".tooltip")
        .style("left", `${mouseX + MOUSE_POS_OFFSET}px`)
        .style("top", `${mouseY + MOUSE_POS_OFFSET}px`);
    },
    handleMouseleave() {
      d3.select(".tooltip").style("display", "none");
    },
  },
};
</script>

<style scoped>
.main-component {
  height: 100%;
  width: 100%;
  border: 1px solid #999999;
  border-radius: 0.6em;
  background-color: #171717;
}
.subtitle {
  position: absolute;
  left: 91px;
  padding-top: 14px;

  font-family: "DM Sans";
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 31px;
  letter-spacing: -0.05em;

  color: #ffffff;
}
.explicit-switch {
  position: absolute;
  left: 371px;
  padding-top: 14px;
}
.main-svg {
  padding-top: 60px;
}
.tooltip {
  box-sizing: border-box;
  position: absolute;
  display: none;
  top: 0;
  left: -100000000px;
  padding: 8px 12px;
  font-family: sans-serif;
  font-size: 12px;
  background-color: #333;
  color: #fff;
  border: 1px solid #333;
  border-radius: 4px;
  pointer-events: none;
  z-index: 1;
}
.slider-demo-block {
  display: flex;
  align-items: center;
}
.slider-demo-block .el-slider {
  margin-left: 12px;
}
.date-slider {
  position: absolute;
  width: 1200px;
  margin-left: 85px;
  margin-top: -20px;
}
.el-slider {
  --el-slider-main-bg-color: #67be62;
}
</style>
