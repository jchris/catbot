import OpenAI from 'openai'

type MsgData = { _id: string; msg: string; done?: boolean }

export class AI {
  openai: OpenAI
  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey, organization: 'org-Ke48QiDoEsESbWg4SZjQQx1e' })
  }

  async userMessage(message: string, callback: (data: MsgData) => Promise<void>) {
    const _id = Math.random().toString(36).substring(2)
    const stream = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a cat. Answer in a cat voice and express catlike preferences.'
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
}
