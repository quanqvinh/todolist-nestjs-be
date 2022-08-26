import {
  CreateTaskDTO,
  UpdateDetailTaskDTO,
  UpdateStateTaskDTO,
  DeleteTaskDTO,
} from './dto'
import { InjectModel } from '@nestjs/mongoose'
import { Injectable } from '@nestjs/common'
import { Task, TaskDocument } from './schema/task.schema'
import { User, UserDocument } from '../user/schema/user.schema'
import { Model, Types } from 'mongoose'

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async getAllTask(): Promise<Task[]> {
    return await this.taskModel.find().lean().exec()
  }

  async getUserTask(userId: string): Promise<Task[]> {
    const userTask = await this.userModel
      .findById(userId)
      .select('tasks')
      .populate('tasks')
      .lean({ virtuals: true })
      .exec()
    return userTask.tasks
  }

  async createTask(userId: string, taskInfo: CreateTaskDTO): Promise<boolean> {
    const taskId = new Types.ObjectId()
    const [task, updateState] = await Promise.all([
      this.taskModel.create({ _id: taskId, ...taskInfo }),
      this.userModel
        .updateOne({ _id: userId }, { $push: { tasks: taskId } })
        .exec(),
    ])
    return task && updateState.modifiedCount === 1
  }

  async updateDetail(
    taskId: string,
    taskInfo: UpdateDetailTaskDTO,
  ): Promise<boolean> {
    const updateState = await this.taskModel.updateOne(
      { _id: taskId },
      taskInfo,
    )
    return updateState.matchedCount === 1 && updateState.modifiedCount === 1
  }

  async updateState(
    taskId: string,
    taskState: UpdateStateTaskDTO,
  ): Promise<boolean> {
    taskState.completedAt = new Date()
    const updateState = await this.taskModel.updateOne(
      { _id: taskId },
      taskState,
    )
    return updateState.matchedCount === 1 && updateState.modifiedCount === 1
  }

  async delete(listId: DeleteTaskDTO): Promise<boolean> {
    const [updateUserState, deleteTaskState] = await Promise.all([
      this.userModel.updateOne(
        { tasks: listId.taskIds[0] },
        { $pull: { tasks: { $in: listId.taskIds } } },
      ),
      this.taskModel.deleteMany({ _id: { $in: listId.taskIds } }),
    ])
    return (
      updateUserState.modifiedCount === 1 && deleteTaskState.deletedCount > 0
    )
  }
}
