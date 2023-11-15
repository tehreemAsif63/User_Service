export class MQTTException extends Error {
  code: number
  constructor({ message, code }: { message: string; code: number }) {
    super(message)
    this.name = 'MQTTException'
    this.code = code
  }
}
