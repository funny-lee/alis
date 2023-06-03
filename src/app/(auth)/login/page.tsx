import { Metadata } from "next"
import Link from "next/link"
import { Mail } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { UserAuthForm } from "@/components/user-auth-form"

export const metadata: Metadata = {
  title: "登录",
  description: "登录账号",
}

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="container  absolute left-4 top-6 flex flex-row   md:left-8 md:top-8">
        <div>
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "ghost" }), "")}
          >
            <>
              <Icons.chevronLeft className="mr-2 h-4 w-4" />
              Back
            </>
          </Link>
        </div>
        <div>
          <Link
            href="https://mail.qq.com/"
            className={cn(buttonVariants({ variant: "ghost" }), "")}
          >
            <>
              <Mail className="mr-2 h-4 w-4" />
              QQ邮箱
            </>
          </Link>
        </div>
      </div>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Icons.logo className="mx-auto h-6 w-6" />
          <h1 className="text-2xl font-semibold tracking-tight">欢迎登录</h1>
          <p className="text-sm text-muted-foreground">使用邮箱登录</p>
        </div>
        <UserAuthForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/register"
            className="hover:text-brand underline underline-offset-4"
          >
            没有账号？点击注册
          </Link>
        </p>
      </div>
    </div>
  )
}
