import { Task } from '../../task/schema/task.schema'
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type UserDocument = User & Document

@Schema({ versionKey: false })
export class User {
  @Prop({ required: true, unique: true })
  email: string

  @Prop()
  name?: string

  @Prop()
  avatar?: string

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Task' }] })
  tasks: [Task]
}

export const UserSchema = SchemaFactory.createForClass(User)
