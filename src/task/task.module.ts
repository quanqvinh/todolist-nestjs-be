import { MongooseModule } from '@nestjs/mongoose'
import { Module } from '@nestjs/common'
import { TaskService } from './task.service'
import { TaskController } from './task.controller'
import { Task, TaskSchema } from './schema/task.schema'
import { User, UserSchema } from 'src/user/schema/user.schema'
import { AuthModule } from 'src/auth/auth.module'
import { GoogleStrategy } from 'src/auth/config/google.strategy'
import { JwtStrategy } from 'src/auth/config/jwt.strategy'
import { JwtModule } from '@nestjs/jwt'

@Module({
  controllers: [TaskController],
  providers: [TaskService, GoogleStrategy, JwtStrategy],
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
  ],
})
export class TaskModule {}
