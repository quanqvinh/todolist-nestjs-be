import { UpdateUserTaskDto } from './dto/update-user-task.dto'
import { UpdateUserInfoDto } from './dto/update-user-info.dto'
import { CreateUserDto } from './dto/create-user.dto'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, ObjectId } from 'mongoose'
import { UpdateResult, DeleteResult } from 'mongodb'
import { User, UserDocument } from './schema/user.schema'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.model.find().exec()
  }

  async find(userId: ObjectId | string): Promise<User> {
    return await this.model.findOne({ _id: userId }).exec()
  }

  async create(user: CreateUserDto): Promise<User> {
    return await this.model.create({ ...user })
  }

  async updateInfo(
    userId: ObjectId | string,
    userInfo: UpdateUserInfoDto,
  ): Promise<UpdateResult> {
    return await this.model.updateOne({ _id: userId }, { ...userInfo }).exec()
  }

  async addTask(
    userId: ObjectId | string,
    userTask: UpdateUserTaskDto,
  ): Promise<UpdateResult> {
    return await this.model
      .updateOne({ _id: userId }, { $push: { tasks: { $in: userTask.tasks } } })
      .exec()
  }

  async deleteTask(
    userId: ObjectId | string,
    userTask: UpdateUserTaskDto,
  ): Promise<UpdateResult> {
    return await this.model
      .updateOne({ _id: userId }, { $pull: { tasks: { $in: userTask.tasks } } })
      .exec()
  }

  async delete(userId: ObjectId | string): Promise<DeleteResult> {
    return await this.model.deleteOne({ _id: userId }).exec()
  }
}
