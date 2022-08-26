import { DeleteTaskDTO } from './dto/delete-task.dto'
import { UpdateStateTaskDTO } from './dto/update-state-task.dto'
import { CreateTaskDTO, UpdateDetailTaskDTO } from './dto'
import {
  Body,
  Query,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
import { Task } from './schema/task.schema'
import { TaskService } from './task.service'

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async getAll(): Promise<Task[]> {
    return await this.taskService.getAllTask()
  }

  @Get()
  async getUserTask(@Query('userId') userId: string): Promise<Task[]> {
    return await this.taskService.getUserTask(userId)
  }

  @Post(':id')
  async create(
    @Param('id') userId: string,
    @Body() data: CreateTaskDTO,
  ): Promise<boolean> {
    return await this.taskService.createTask(userId, data)
  }

  @Patch('detail/:id')
  async updateDetail(
    @Param('id') taskId: string,
    @Body() taskDetail: UpdateDetailTaskDTO,
  ): Promise<boolean> {
    return await this.taskService.updateDetail(taskId, taskDetail)
  }

  @Patch('state/:id')
  async updateState(
    @Param('id') taskId: string,
    @Body() taskState: UpdateStateTaskDTO,
  ): Promise<boolean> {
    return await this.taskService.updateState(taskId, taskState)
  }

  @Delete(':id')
  async deleteOne(@Param('id') taskId: string): Promise<boolean> {
    const listIds: DeleteTaskDTO = { taskIds: [taskId] }
    return await this.taskService.delete(listIds)
  }

  @Delete()
  async deleteMany(@Query('id') taskIds: string[]): Promise<boolean> {
    const listIds: DeleteTaskDTO = { taskIds }
    return await this.taskService.delete(listIds)
  }
}
