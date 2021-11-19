export interface IContext {
  user: { id: string } | null
}

export class ResolverError extends Error {
  code: string
  constructor(message: string, code: string) {
    super(message)
    this.code = code
  }
}
