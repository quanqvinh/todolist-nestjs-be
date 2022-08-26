import { Priority } from './../schema/task.schema'

export class CreateTaskDTO {
  title: string
  deadline?: Date | string
  priority: Priority
}
