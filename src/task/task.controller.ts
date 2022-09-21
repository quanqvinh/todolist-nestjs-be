import { AuthenticatedUser } from 'src/auth/config/jwt.strategy'
import { JwtAuthGuard } from './../auth/guard/jwt-auth.guard'
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
  UseGuards,
  ForbiddenException,
} from '@nestjs/common'
import { TaskService } from './task.service'
import { User } from 'src/user/decorator/user.decorator'

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserTask(@User() user: AuthenticatedUser): Promise<any> {
    console.log(user)
    return await this.taskService.getUserTask(user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @User() user: AuthenticatedUser,
    @Body() data: CreateTaskDTO,
  ): Promise<boolean> {
    return await this.taskService.createTask(user.id, data)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/detail')
  async updateDetail(
    @User() user: AuthenticatedUser,
    @Param('id') taskId: string,
    @Body() taskDetail: UpdateDetailTaskDTO,
  ): Promise<boolean> {
    const idMatchedUser = await this.taskService.checkUser(user.id, taskId)
    if (!idMatchedUser) throw new ForbiddenException()
    return await this.taskService.updateDetail(taskId, taskDetail)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/state')
  async updateState(
    @User() user: AuthenticatedUser,
    @Param('id') taskId: string,
    @Body() taskState: UpdateStateTaskDTO,
  ): Promise<boolean> {
    const idMatchedUser = await this.taskService.checkUser(user.id, taskId)
    if (!idMatchedUser) throw new ForbiddenException()
    return await this.taskService.updateState(taskId, taskState)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteOne(
    @User() user: AuthenticatedUser,
    @Param('id') taskId: string,
  ): Promise<boolean> {
    const idMatchedUser = await this.taskService.checkUser(user.id, taskId)
    if (!idMatchedUser) throw new ForbiddenException()
    const listIds: DeleteTaskDTO = { taskIds: [taskId] }
    return await this.taskService.delete(listIds)
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteMany(
    @User() user: AuthenticatedUser,
    @Query('id') taskIds: string[],
  ): Promise<boolean> {
    const idMatchedUser = await this.taskService.checkUser(user.id, taskIds[0])
    if (!idMatchedUser) throw new ForbiddenException()
    const listIds: DeleteTaskDTO = { taskIds }
    return await this.taskService.delete(listIds)
  }
}
