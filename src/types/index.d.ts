import { User } from "@prisma/client"
import type { Icon } from "lucide-react"
import { Icons } from "@/components/icons"

export interface ITableHeader {
  header: string
  // 用于数据匹配的 key
  key: string
  // 列宽
  width: number
  // 父级的 key
  parentKey?: string
  children?: ITableHeader[]
}

export interface StudentInfo {
  id: number
  name: string
  age: number
  gender: string
  english?: number
  math?: number
  physics?: number
  comment?: string
}

export interface IStyleAttr {
  color?: string
  fontSize?: number
  horizontal?:
    | "fill"
    | "distributed"
    | "justify"
    | "center"
    | "left"
    | "right"
    | "centerContinuous"
    | undefined
  bold?: boolean
}

export type NavItem = {
  title: string
  href: string
  disabled?: boolean
}

export type MainNavItem = NavItem

export type SidebarNavItem = {
  title: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
} & (
  | {
      href: string
      items?: never
    }
  | {
      href?: string
      items: NavLink[]
    }
)

export type SiteConfig = {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    twitter: string
    github: string
  }
}

export type DocsConfig = {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export type MarketingConfig = {
  mainNav: MainNavItem[]
}

export type DashboardConfig = {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export type SubscriptionPlan = {
  name: string
  description: string
  stripePriceId: string
}

export type UserSubscriptionPlan = SubscriptionPlan &
  Pick<User, "stripeCustomerId" | "stripeSubscriptionId"> & {
    stripeCurrentPeriodEnd: number
    isPro: boolean
  }
