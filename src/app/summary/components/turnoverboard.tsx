"use client"

import { useCallback, useEffect, useState } from "react"
import { EChartsOption } from "echarts"
import ReactEChartsCore from "echarts-for-react/lib/core"
import { LineChart, PieChart } from "echarts/charts"
import {
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from "echarts/components"
import * as echarts from "echarts/core"
import { LabelLayout, UniversalTransition } from "echarts/features"
import { CanvasRenderer } from "echarts/renderers"
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
import "@/components/walden"

echarts.use([
  DatasetComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  PieChart,
  CanvasRenderer,
  UniversalTransition,
  LabelLayout,
])

let option: EChartsOption = {
  tooltip: {
    trigger: "item",
    backgroundColor: "rgba(250,250,250,0.7)",
  },
  legend: {
    // top: "10%",
    right: 10,
    bottom: "1%",
    left: "center",
  },
  series: [
    {
      name: "占有量",
      type: "pie",
      radius: ["40%", "70%"],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 10,
        borderColor: "#fff",
        borderWidth: 2,
      },

      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: "bold",
        },
      },
      // labelLine: {
      //   show: false,
      // },
      data: [
        { value: 1048, name: "食品饮品" },
        { value: 735, name: "电子设备" },
        { value: 580, name: "文化用品" },
        { value: 484, name: "生活用品" },
        { value: 300, name: "五金器件" },
      ],
    },
  ],
}

const TurnoverBoard = () => {
  //   useEffect(() => {
  //     const fetchData = async () => {
  //   const response = await fetch(

  //   )
  //   const json = await response.json()

  //   setLoading(false)
  // }
  // fetchData()
  //   }, [])
  return (
    <Card>
      <CardContent>
        <ReactEChartsCore
          option={option}
          echarts={echarts}
          notMerge={true}
          lazyUpdate={true}
          theme={"walden"}
          // className="mb-8 mt-8"
        />
      </CardContent>
    </Card>
  )
}

export default TurnoverBoard
