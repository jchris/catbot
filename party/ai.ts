import OpenAI from 'openai'

type MsgData = { _id: string; msgId?: string, img?: string; prompt?: string; msg?: string; done?: boolean }

export class AI {
  openai: OpenAI
  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey, organization: 'org-Ke48QiDoEsESbWg4SZjQQx1e' })
  }

  async userMessage(message: string, callback: (data: MsgData) => Promise<void>) {
    const _id = Math.random().toString(36).substring(2)

    void this.makeRelatedImage(_id, message, callback)

    const stream = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a cat. Answer in a cat voice and express catlike preferences. Be agreeable. Keep your answers short.'
        },
        { role: 'user', content: message }
      ],
      stream: true
    })
    const data: MsgData = { _id, msg: '' }
    callback(data)
    for await (const part of stream) {
      data.msg += part.choices[0]?.delta?.content || ''
      await callback(data)
    }
    data.done = true
    await callback(data)
  }

  async makeRelatedImage(msgId: string, message: string, callback: (data: MsgData) => Promise<void>) {
    const imgId = Math.random().toString(36).substring(2)

    await callback({ _id: imgId, msgId })

    const rawResponse = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `Create an image generation prompt to draw a feline cat based on the user message. If possible use a humorous interpretation of the message to draw the cat.`
        },
        { role: 'user', content: message }
      ],
      temperature: 0,
      max_tokens: 1024
    })

    const imagePrompt = rawResponse.choices[0].message.content!
    console.log('gpt-4', imagePrompt)
    // await callback({ _id: imgId, msgId, prompt: imagePrompt })

    const response = await this.openai.images.generate({
      prompt: imagePrompt,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json'
    })
    console.log('image', response)
    await callback({ _id: imgId, msgId, prompt: imagePrompt, img: response.data[0].b64_json })
  }
}
