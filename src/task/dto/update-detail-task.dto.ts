import { Priority } from '../schema/task.schema'

export class UpdateDetailTaskDTO {
  title?: string
  description?: string
  deadline?: Date | string
  priority?: Priority
}
