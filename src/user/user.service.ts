import { UpdateUserTaskDTO } from './dto/update-user-task.dto'
import { UpdateUserInfoDTO } from './dto/update-user-info.dto'
import { CreateUserDTO } from './dto/create-user.dto'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UpdateResult, DeleteResult } from 'mongodb'
import { User, UserDocument } from './schema/user.schema'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.model.find()
  }

  async find(userId: string): Promise<User> {
    return await this.model.findOne({ _id: userId })
  }

  async create(user: CreateUserDTO): Promise<User> {
    return await this.model.create({ ...user })
  }

  async updateInfo(
    userId: string,
    userInfo: UpdateUserInfoDTO,
  ): Promise<UpdateResult> {
    return await this.model.updateOne({ _id: userId }, { ...userInfo }).exec()
  }

  async addTask(
    userId: string,
    userTask: UpdateUserTaskDTO,
  ): Promise<UpdateResult> {
    return await this.model
      .updateOne({ _id: userId }, { $push: { tasks: { $in: userTask.tasks } } })
      .exec()
  }

  async deleteTask(
    userId: string,
    userTask: UpdateUserTaskDTO,
  ): Promise<UpdateResult> {
    return await this.model
      .updateOne({ _id: userId }, { $pull: { tasks: { $in: userTask.tasks } } })
      .exec()
  }

  async delete(userId: string): Promise<DeleteResult> {
    return await this.model.deleteOne({ _id: userId }).exec()
  }
}
