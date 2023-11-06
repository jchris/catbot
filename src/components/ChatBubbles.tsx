import React, { useState, useEffect } from 'react'
import { DocFileMeta } from 'use-fireproof'

type ImageBubbleProps = {
  imgSrc?: string
  imgFile?: DocFileMeta
  alt?: string
}
export const ImageBubble: React.FC<ImageBubbleProps> = ({
  imgSrc,
  imgFile,
  alt = 'Chat Bubble Image'
}) => {
  return (
    <div className="flex w-full mt-2 space-x-3 max-w-sm p-3 ml-3">
      {imgSrc && <img className="mb-2 rounded" src={imgSrc} alt={alt} />}
      {imgFile && <ImgFile alt={alt} meta={imgFile} />}
      {!imgSrc && !imgFile && <div className="text-8xl">📷</div>}
    </div>
  )
}
type ChatBubbleProps = {
  message: string
  when?: string
}
export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, when }) => {
  return (
    <div className="flex w-full mt-2 space-x-3 max-w-sm">
      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
      <div>
        <div className="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
          <p className="text-sm">{message}</p>
        </div>
        <span className="text-xs text-gray-500 leading-none">{when}</span>
      </div>
    </div>
  )
}
type UserBubbleProps = {
  message: string
  when?: string
}
export const UserBubble: React.FC<UserBubbleProps> = ({ message, when }) => {
  return (
    <div className="flex w-full mt-2 space-x-3 max-w-sm ml-auto justify-end">
      <div>
        <div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
          <p className="text-sm">{message}</p>
        </div>
        <span className="text-xs text-gray-500 leading-none">{when}</span>
      </div>
      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
    </div>
  )
}
function ImgFile({ meta, alt }: { alt: string; meta: DocFileMeta; cache?: boolean }) {
  const [imgDataUrl, setImgDataUrl] = useState('')

  useEffect(() => {
    if (meta.file && /image/.test(meta.type)) {
      meta.file().then(file => {
        const src = URL.createObjectURL(file)
        setImgDataUrl(src)
        return () => {
          URL.revokeObjectURL(src)
        }
      })
    }
  }, [meta])

  if (imgDataUrl) {
    return <img title={alt} className="mb-2 rounded" alt={alt} src={imgDataUrl} />
  } else {
    return <></>
  }
}
