"use client"

import React from "react"

//close page after 5 seconds
export default function CountandExit() {
  const [count, setCount] = React.useState(5)
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          window.close()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="text-2xl font-medium text-gray-900">您已经成功登录</div>
      <div className="text-4xl font-bold text-gray-900">{count}</div>
      <div className="text-2xl font-medium text-gray-900">秒后跳转回应用</div>
    </div>
  )
}
