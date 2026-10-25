import { timingSafeEqual } from 'crypto'

export function isAdminSecret(input: unknown): boolean {
  const secret = process.env.NOTIFY_SECRET
  if (!secret || typeof input !== 'string') return false
  const a = Buffer.from(input)
  const b = Buffer.from(secret)
  return a.length === b.length && timingSafeEqual(a, b)
}
