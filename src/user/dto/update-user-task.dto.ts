import { ObjectId } from 'mongoose'

export interface UpdateUserTaskDto {
  tasks: ObjectId[]
}
