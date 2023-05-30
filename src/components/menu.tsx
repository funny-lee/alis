"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
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
          <MenubarSub>
            <MenubarSubTrigger>上传文件</MenubarSubTrigger>
            <MenubarSubContent className="w-[230px]">
              <MenubarItem>图片</MenubarItem>

              <MenubarItem>文档</MenubarItem>
              <MenubarItem>Playlist Folder</MenubarItem>
              <MenubarItem disabled>Genius Playlist</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarItem>
            Open Stream URL... <MenubarShortcut>⌘U</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Close Window <MenubarShortcut>⌘W</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Library</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Update Cloud Library</MenubarItem>
              <MenubarItem>Update Genius</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Organize Library...</MenubarItem>
              <MenubarItem>Export Library...</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Import Playlist...</MenubarItem>
              <MenubarItem disabled>Export Playlist...</MenubarItem>
              <MenubarItem>Show Duplicate Items</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Get Album Artwork</MenubarItem>
              <MenubarItem disabled>Get Track Names</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarItem>
            Import... <MenubarShortcut>⌘O</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled>Burn Playlist to Disc...</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Show in Finder <MenubarShortcut>⇧⌘R</MenubarShortcut>{" "}
          </MenubarItem>
          <MenubarItem>Convert</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Page Setup...</MenubarItem>
          <MenubarItem disabled>
            Print... <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>人员管理</MenubarTrigger>
        <MenubarContent>
          <MenubarItem disabled>
            Undo <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled>
            Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem disabled>
            Cut <MenubarShortcut>⌘X</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled>
            Copy <MenubarShortcut>⌘C</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled>
            Paste <MenubarShortcut>⌘V</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Select All <MenubarShortcut>⌘A</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled>
            Deselect All <MenubarShortcut>⇧⌘A</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Smart Dictation...{" "}
            <MenubarShortcut>
              <Mic className="h-4 w-4" />
            </MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Emoji & Symbols{" "}
            <MenubarShortcut>
              <Globe className="h-4 w-4" />
            </MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger className="hidden md:block">账号管理</MenubarTrigger>
        <MenubarContent forceMount>
          <MenubarLabel inset>Switch Account</MenubarLabel>
          <MenubarSeparator />
          <MenubarRadioGroup value="benoit">
            <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
            <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
            <MenubarRadioItem value="Luis">Luis</MenubarRadioItem>
          </MenubarRadioGroup>
          <MenubarSeparator />
          <MenubarItem inset>Manage Famliy...</MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>Add Account...</MenubarItem>
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
