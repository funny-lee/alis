"use client"

// import { Link } from "lucide-react";
import { useEffect, useState } from "react"
import { Metadata } from "next"
import Head from "next/head"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  PageContainer,
  ProCard,
  ProLayout,
  ProSettings,
} from "@ant-design/pro-components"
import {
  Buy,
  ChartPieOne,
  H,
  Home,
  MultiTriangularFour,
} from "@icon-park/react"
import collapse from "antd/es/collapse"
import { Header } from "antd/es/layout/layout"
import { settings } from "cluster"
import { SessionProvider, useSession } from "next-auth/react"
import { fontMono, fontSans } from "@/lib/fonts"
import { getCurrentUser } from "@/lib/session"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import { Menu } from "@/components/menu"
import { StyleSwitcher } from "@/components/style-switcher"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"
import { UserAccountNav } from "@/components/user-account-nav"
import "@/styles/globals.css"

interface RootLayoutProps {
  children: React.ReactNode
}
export default function RootLayout({ children }: RootLayoutProps) {
  // const [collapse, setCollapse] = useState(true) // eslint-disable-line
  // useEffect(() => {
  //   setCollapse(false)
  // }, [])
  // const [width, setWidth] = useState(64)
  // const [pathname, setPathname] = useState("/")

  return (
    <SessionProvider>
      <html lang="en" suppressHydrationWarning>
        {/* <Head children={undefined} /> */}
        <body className="scrollbar-none bg-transparent font-sans antialiased">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="h-screen overflow-clip rounded-lg border">
              <Menu />

              <div
                className={cn(
                  "h-screen overflow-auto border-t bg-background pb-8",
                  "scrollbar-none"
                  // "scrollbar scrollbar-track-rounded-lg scrollbar-thumb-rounded-lg scrollbar-thumb-gray-900 scrollbar-track-gray-100"
                )}
              >
                {children}
                <Toaster />
              </div>
            </div>
          </ThemeProvider>
          <StyleSwitcher />
        </body>
      </html>
    </SessionProvider>
  )
}
