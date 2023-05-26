"use client"

import { useState } from "react"
import { ProCard, StatisticCard } from "@ant-design/pro-components"
import { EChartsCoreOption } from "echarts"
import ReactEChartsCore from "echarts-for-react/lib/core"
import { EChartsInstance } from "echarts-for-react/lib/types"
import { HeatmapChart, HeatmapSeriesOption } from "echarts/charts"
import {
  GridComponent,
  GridComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  VisualMapComponent,
  VisualMapComponentOption,
} from "echarts/components"
import * as echarts from "echarts/core"
import { CanvasRenderer } from "echarts/renderers"
import "echarts/theme/macarons"
import { CreditCard } from "lucide-react"
import RcResizeObserver from "rc-resize-observer"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

echarts.use([
  TooltipComponent,
  GridComponent,
  VisualMapComponent,
  HeatmapChart,
  CanvasRenderer,
])
//use echarts-for-react bachart and line chart to show the sales of different
let option: EChartsCoreOption = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      crossStyle: {
        color: "#999",
      },
    },
  },
  toolbox: {
    feature: {
      dataView: { show: true, readOnly: false },
      magicType: { show: true, type: ["line", "bar"] },
      restore: { show: true },
      saveAsImage: { show: true },
    },
  },
  legend: {
    data: ["Evaporation", "Precipitation", "Temperature"],
  },
  xAxis: [
    {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      axisPointer: {
        type: "shadow",
      },
    },
  ],
  yAxis: [
    {
      type: "value",
      name: "Precipitation",
      min: 0,
      max: 250,
      interval: 50,
      axisLabel: {
        formatter: "{value} ml",
      },
    },
    {
      type: "value",
      name: "Percentage",
      min: 0,
      max: 1,

      axisLabel: {
        formatter: "{value} ",
      },
    },
  ],
  series: [
    {
      name: "Evaporation",
      type: "bar",
      tooltip: {
        valueFormatter: function (value) {
          return (value as number) + " ml"
        },
      },
      data: [
        2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3,
      ].sort((a, b) => b - a),
    },
    {
      name: "Temperature",
      type: "line",
      yAxisIndex: 1,
      tooltip: {
        valueFormatter: function (value) {
          return (value as number) + " %"
        },
      },
      data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2],
    },
    {
      name: "line",
      type: "line",
      stack: "all",
      symbolSize: 6,
      markLine: {
        data: [
          {
            name: "90",
            yAxis: 220,
            label: {
              formatter: "{b}",
              position: "end",
            },
          },
        ],
        label: {
          distance: [20, 8],
        },
      },
    },
  ],
}
const ParetoAnalysis = () => {
  let numbers = [
    2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3,
  ].sort((a, b) => b - a)
  const sum = numbers.reduce((acc, curr) => acc + curr, 0)
  const percentages = numbers.map((n) => n / sum)

  const cumulativePercentages = percentages.reduce((acc, curr) => {
    const lastValue = acc.length > 0 ? acc[acc.length - 1] : 0
    acc.push(lastValue + curr)
    return acc
  }, [])
  option.series.find((s) => s.name === "Temperature").data =
    cumulativePercentages
  return (
    <Card>
      <CardHeader className="flex  space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">库存商品ABC分析</CardTitle>
        <CardDescription>辅助发现重要商品</CardDescription>
      </CardHeader>
      <CardContent>
        <ReactEChartsCore
          echarts={echarts}
          option={option}
          theme={"macarons"}
        />
      </CardContent>
    </Card>
  )
}

export default ParetoAnalysis
