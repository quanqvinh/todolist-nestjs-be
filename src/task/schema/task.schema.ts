import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import * as mongooseDelete from 'mongoose-delete'
import { mongooseLeanVirtuals } from 'mongoose-lean-virtuals'
import * as mongooseTimezone from 'mongoose-timezone'

export type TaskDocument = Task & Document

export enum Priority {
  LOW,
  MEDIUM,
  HIGH,
}

export enum Evaluate {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  PRETTY_GOOD = 'PRETTY GOOD',
  UNSATISFACTORY = 'UNSATISFACTORY',
}

@Schema({
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
})
export class Task {
  @Prop({ required: true })
  title: string

  @Prop()
  description: string

  @Prop({ default: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) })
  deadline: Date

  @Prop({ default: Priority.LOW })
  priority: Priority

  @Prop({ default: false })
  completed: boolean

  @Prop()
  completedAt: Date

  @Prop()
  createdAt: Date

  @Prop()
  updatedAt: Date
}

const TaskSchema = SchemaFactory.createForClass(Task)

TaskSchema.plugin(mongooseDelete, { deletedAt: true })
TaskSchema.plugin(mongooseLeanVirtuals)
TaskSchema.plugin(mongooseTimezone)

TaskSchema.virtual<number>('remainTime').get(function (this: TaskDocument) {
  return this.deadline.getTime() - Date.now()
})
TaskSchema.virtual<Evaluate>('evaluate').get(function (this: TaskDocument) {
  if (!this.completedAt)
    return Date.now() < this.deadline.getTime()
      ? undefined
      : Evaluate.UNSATISFACTORY
  const different = this.deadline.getTime() - this.completedAt.getTime()
  if (different > 1000 * 60 * 60 * 24) return Evaluate.EXCELLENT
  else if (different > 1000 * 60 * 60 * 2) return Evaluate.GOOD
  else if (different > 0) return Evaluate.PRETTY_GOOD
  else return Evaluate.UNSATISFACTORY
})

TaskSchema.pre<Task>('validate', function (next) {
  if (this.createdAt >= this.deadline)
    next(new Error('Deadline must be later than created time'))
  else next()
})

export { TaskSchema }
