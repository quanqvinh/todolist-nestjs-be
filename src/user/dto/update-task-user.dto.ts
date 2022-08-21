import { ObjectId } from 'mongoose'
import { BaseUserDto } from './base-user.dto'

export class UpdateTaskUserDto extends BaseUserDto {
  tasks: ObjectId[]
}
