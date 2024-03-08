import nodemailer from "nodemailer"

let transporter = nodemailer.createTransport({
  host: "smtp.qq.com", //使用内置的qq发送邮件
  port: 587,
  secure: false,
  auth: {
    user: "1750285541",
    pass: "elvndrhuwguzbfeg",
  },
})
