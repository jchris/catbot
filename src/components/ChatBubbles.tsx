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
type ImageCircleProps = {
  imgSrc?: string
  imgFile?: DocFileMeta
  alt?: string
}

export const ImageCircle: React.FC<ImageCircleProps> = ({
  imgSrc,
  imgFile,
  alt = 'Chat Bubble Image'
}) => {
  return (
    <div className="flex-shrink-0 h-10 w-10 rounded-full ml-3 bg-gray-300">
      {imgSrc && <img className="object-cover rounded-full m-0" src={imgSrc} alt={alt} />}
      {imgFile && <ImgFile className="object-cover rounded-full m-0" alt={alt} meta={imgFile} />}
    </div>
  )
}

type ChatBubbleProps = {
  message: string
  when?: string
  imgSrc?: string
  imgFile?: DocFileMeta
}
export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, imgSrc, imgFile, when }) => {
  return (
    <div className="flex w-full mt-2 space-x-3 max-w-sm">
      <ImageCircle imgSrc={imgSrc} imgFile={imgFile} alt="Chat Model" />
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
  imgSrc?: string
  imgFile?: DocFileMeta
}
export const UserBubble: React.FC<UserBubbleProps> = ({ message, imgSrc, imgFile, when }) => {
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
function ImgFile({
  meta,
  alt,
  className
}: {
  alt: string
  meta: DocFileMeta
  className?: string
  cache?: boolean
}) {
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
    return <img className={className} title={alt} alt={alt} src={imgDataUrl} />
  } else {
    return <></>
  }
}
