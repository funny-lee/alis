"use client"

import { usePathname } from "next/navigation"
import {
  MenubarContent,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarTrigger,
} from "@/components/ui/menubar"

const mypages = [
  {
    href: "/hello",
    name: "主页",
  },
  {
    href: "/po",
    name: "采购管理",
  },
  {
    href: "/arrival",
    name: "到货管理",
  },
  {
    href: "/summary",
    name: "数据汇总",
  },
  {
    href: "/quality-check",
    name: "质检管理",
  },
  {
    href: "/login",
    name: "登录",
  },
]

interface MyNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function MyPagesNav({ className, ...props }: MyNavProps) {
  const pathname = usePathname() === "/" ? "/login" : usePathname()

  return (
    <MenubarMenu>
      <MenubarTrigger>{pathname}</MenubarTrigger>
      <MenubarContent forceMount>
        <MenubarRadioGroup value={pathname}>
          {mypages.map((example) => (
            <a href={example.href} key={example.name}>
              <MenubarRadioItem value={example.href}>
                {example.name}
              </MenubarRadioItem>
            </a>
          ))}
        </MenubarRadioGroup>
      </MenubarContent>
    </MenubarMenu>
  )
}
