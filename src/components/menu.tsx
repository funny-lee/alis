"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound, usePathname } from "next/navigation"
import logo from "@/assets/logo.png"
import type { WebviewWindow } from "@tauri-apps/api/window"
import { Building2, Globe, Maximize, Mic, X } from "lucide-react"
import { getCurrentUser } from "@/lib/session"
import { Button } from "@/components/ui/button"
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { Icons } from "./icons"
import { ModeToggle } from "./mode-toggle"
import { MyPagesNav } from "./my-nav"
import { UserAccountNav } from "./user-account-nav"

export function Menu() {
  const [appWindow, setAppWindow] = useState<null | WebviewWindow>(null)

  // Dinamically import the tauri API, but only when it's in a tauri window
  useEffect(() => {
    import("@tauri-apps/api/window").then(({ appWindow }) => {
      setAppWindow(appWindow)
    })
  }, [])

  const minimizeWindow = () => {
    appWindow?.minimize()
  }
  const maximizeWindow = async () => {
    if (await appWindow?.isMaximized()) {
      appWindow?.unmaximize()
    } else {
      appWindow?.maximize()
    }
  }
  const closeWindow = () => {
    appWindow?.close()
  }

  return (
    <Menubar className="rounded-none border-b border-none pl-2 lg:pl-4">
      <MenubarMenu>
        <div className="inline-flex h-fit w-fit items-center text-cyan-500">
          {usePathname() === "/" || usePathname() === "/examples/music" ? (
            <Image src={logo} alt="logo" width={40} />
          ) : (
            <Building2 className="h-5 w-5" />
          )}
        </div>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="w-fit font-bold ">主页</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>入库</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>出库</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>库存情况</MenubarItem>
          <MenubarItem>数据汇总</MenubarItem>

          <MenubarItem onClick={closeWindow}>退出应用</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="relative">文件管理</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Link href="/filemanage">上传文件</Link>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>人员管理</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Link href="/workermanage">管理页面</Link>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger className="hidden md:block">账号管理</MenubarTrigger>
        <MenubarContent forceMount>
          <MenubarLabel inset>切换账号</MenubarLabel>
          <MenubarSeparator />
          <MenubarRadioGroup value="zhangsan">
            <MenubarRadioItem value="zhangsan">张三</MenubarRadioItem>
            <MenubarRadioItem value="lisi">李四</MenubarRadioItem>
            <MenubarRadioItem value="wangfei">王飞</MenubarRadioItem>
          </MenubarRadioGroup>
          <MenubarSeparator />

          <MenubarItem inset>
            <Link href="/accountsmanage">账号管理</Link>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MyPagesNav />
      <div
        data-tauri-drag-region
        className="inline-flex h-full w-full justify-end"
      >
        <div className="pr-3">
          <ModeToggle />
        </div>

        <Button
          onClick={minimizeWindow}
          variant="ghost"
          className="h-8 focus:outline-none"
        >
          <Icons.minimize className="h-3 w-3" />
        </Button>
        <Button
          onClick={maximizeWindow}
          variant="ghost"
          className="h-8 focus:outline-none"
        >
          <Maximize className="h-4 w-4" />
        </Button>
        <Button
          onClick={closeWindow}
          variant="ghost"
          className="h-8 focus:outline-none"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Menubar>
  )
}
