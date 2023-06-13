import docxtemplater from "docxtemplater"
import ImageModule from "docxtemplater-image-module-free"
import { saveAs } from "file-saver"
import JsBarcode from "jsbarcode"
import JSZipUtils from "jszip-utils"
import PizZip from "pizzip"

function base64DataURLToArrayBuffer(dataURL: string) {
  const base64Regex = /^data:image\/(png|jpg|jpeg|svg|svg\+xml);base64,/
  if (!base64Regex.test(dataURL)) {
    return false
  }
  const stringBase64 = dataURL.replace(base64Regex, "")
  let binaryString
  if (typeof window !== "undefined") {
    binaryString = window.atob(stringBase64)
  } else {
    binaryString = Buffer.from(stringBase64, "base64").toString("binary")
  }
  const len = binaryString.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    const ascii = binaryString.charCodeAt(i)
    bytes[i] = ascii
  }
  return bytes.buffer
}
const base64Regex = /^data:image\/(png|jpg|svg|svg\+xml);base64,/
function base64Parser(dataURL) {
  if (typeof dataURL !== "string" || !base64Regex.test(dataURL)) {
    return false
  }

  const validBase64 =
    /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/

  if (!validBase64.test(dataURL)) {
    throw new Error(
      "Error parsing base64 data, your data contains invalid characters"
    )
  }

  const stringBase64 = dataURL.replace(base64Regex, "")

  // For nodejs, return a Buffer
  if (typeof Buffer !== "undefined" && Buffer.from) {
    return Buffer.from(stringBase64, "base64")
  }

  // For browsers, return a string (of binary content) :
  const binaryString = window.atob(stringBase64)
  const len = binaryString.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    const ascii = binaryString.charCodeAt(i)
    bytes[i] = ascii
  }
  return bytes.buffer
}
export const exportWordDocx = (
  demoUrl: any,
  docxData: any,
  fileName: string | undefined
) => {
  console.log(docxData)
  var expressions = require("angular-expressions")
  var assign = require("lodash/assign")
  var last = require("lodash/last")
  expressions.filters.lower = function (input) {
    // This condition should be used to make sure that if your input is
    // undefined, your output will be undefined as well and will not
    // throw an error
    if (!input) return input
    // toLowerCase() 方法用于把字符串转换为小写。
    return input.toLowerCase()
  }
  function angularParser(tag) {
    tag = tag
      .replace(/^\.$/, "this")
      .replace(/(’|‘)/g, "'")
      .replace(/(“|”)/g, '"')
    const expr = expressions.compile(tag)
    return {
      get: function (scope, context) {
        let obj = {}
        const index = last(context.scopePathItem)
        const scopeList = context.scopeList
        const num = context.num
        for (let i = 0, len = num + 1; i < len; i++) {
          obj = assign(obj, scopeList[i])
        }
        //word模板中使用 $index+1 创建递增序号
        obj = assign(obj, { $index: index })
        return expr(scope, obj)
      },
    }
  }
  // 读取并获得模板文件的二进制内容
  JSZipUtils.getBinaryContent(
    demoUrl,
    function (error: any, content: PizZip.LoadData) {
      // 抛出异常
      if (error) {
        throw error
      }
      expressions.filters.size = function (input, width, height) {
        return {
          data: input,
          size: [width, height],
        }
      }
      let opts = {
        fileType: "docx",
        getImage(tag) {
          return base64DataURLToArrayBuffer(tag)
        },
        getSize() {
          return [200, 100]
        },
      }

      // opts.getImage = (chartId) => {
      //   //将base64的数据转为ArrayBuffer
      //   return base64DataURLToArrayBuffer(chartId)
      // }
      // opts.getSize = function (img, tagValue, tagName) {
      //   //自定义指定图像大小
      //   if (imgSize.hasOwnProperty(tagName)) {
      //     return imgSize[tagName]
      //   } else {
      //     return [200, 200]
      //   }
      // }
      // const imageOptions = {
      //   getImage(tag) {
      //     return base64Parser(tag)
      //   },
      //   getSize() {
      //     return [200, 200]
      //   },
      // }
      // 创建一个PizZip实例，内容为模板的内容
      let zip = new PizZip(content)
      // 创建并加载docxtemplater实例对象
      let doc = new docxtemplater().loadZip(zip)
      doc.attachModule(new ImageModule(opts))
      // 去除未定义值所显示的undefined
      doc.setOptions({
        nullGetter: function () {
          return ""
        },
        parser: angularParser,
      }) // 设置角度解析器
      // doc.setOptions({ parser: angularParser })
      // 设置模板变量的值，对象的键需要和模板上的变量名一致，值就是你要放在模板上的值
      // doc.setOptions({ parser: angularParser })
      doc.setData({
        ...docxData,
      })

      try {
        // 用模板变量的值替换所有模板变量
        doc.render()
      } catch (error) {
        // 抛出异常
        let e = {
          message: error.message,
          name: error.name,
          stack: error.stack,
          properties: error.properties,
        }
        console.log(JSON.stringify({ error: e }))
        throw error
      }

      // 生成一个代表docxtemplater对象的zip文件（不是一个真实的文件，而是在内存中的表示）
      let out = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      })
      // 将目标文件对象保存为目标类型的文件，并命名
      saveAs(out, fileName)
    }
  )
}

/**
 * 将图片的url路径转为base64路径
 * 可以用await等待Promise的异步返回
 * @param {Object} imgUrl 图片路径
 */
export function getBase64Sync(imgUrl) {
  return new Promise(function (resolve, reject) {
    // 一定要设置为let，不然图片不显示
    let image = new Image()
    //图片地址
    image.src = imgUrl
    // 解决跨域问题
    image.setAttribute("crossOrigin", "*") // 支持跨域图片
    // image.onload为异步加载
    image.onload = function () {
      let canvas = document.createElement("canvas")
      canvas.width = image.width
      canvas.height = image.height
      let context = canvas.getContext("2d")
      context.drawImage(image, 0, 0, image.width, image.height)
      //图片后缀名
      let ext = image.src
        .substring(image.src.lastIndexOf(".") + 1)
        .toLowerCase()
      //图片质量
      let quality = 0.9
      //转成base64
      let dataurl = canvas.toDataURL("image/" + ext, quality)
      //返回
      resolve(dataurl)
    }
  })
}
