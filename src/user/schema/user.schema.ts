import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document, ObjectId } from 'mongoose'

export type UserDocument = User & Document

@Schema({ versionKey: false })
export class User {
  @Prop({ required: true, unique: true })
  email: string

  @Prop()
  name?: string

  @Prop()
  avatar?: string

  @Prop({ required: true, default: [] })
  tasks: ObjectId[]
}

export const UserSchema = SchemaFactory.createForClass(User)
