import { MongooseModule } from '@nestjs/mongoose'
import { Module } from '@nestjs/common'
import { TaskService } from './task.service'
import { TaskController } from './task.controller'
import { Task, TaskSchema } from './schema/task.schema'
import { User, UserSchema } from 'src/user/schema/user.schema'

@Module({
  controllers: [TaskController],
  providers: [TaskService],
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
})
export class TaskModule {}
