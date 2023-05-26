"use client"

import React, { useRef } from "react"
import ReactToPrint from "react-to-print"
import { Button } from "@/components/ui/button"
import ShowPO from "../po/page"

const ComponentToPrint = React.forwardRef((props, ref) => {
  return (
    <div ref={ref}>
      <ShowPO />
    </div>
  )
})

const PrintTable = () => {
  const componentRef = useRef()

  return (
    <div>
      <ReactToPrint
        trigger={() => <button>Print this out!</button>}
        content={() => componentRef.current}
      />
      <ComponentToPrint ref={componentRef} />
    </div>
  )
}

export default PrintTable
