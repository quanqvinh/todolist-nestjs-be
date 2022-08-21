import { ObjectId } from 'mongoose'

export class BaseUserDto {
  id: ObjectId
  email?: string
}
