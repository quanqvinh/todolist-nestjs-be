import { UpdateUserInfoDto } from './dto/update-user-info.dto'
import { CreateUserDto } from './dto/create-user.dto'
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
import { User } from './schema/user.schema'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get()
  async getUser(@Param('id') userId: string): Promise<User> {
    return await this.service.find(userId)
  }

  @Post()
  async createNewUser(@Body() createUserDto: CreateUserDto): Promise<boolean> {
    const createdUser = await this.service.create(createUserDto)
    console.log(createdUser)
    return Boolean(createdUser)
  }

  @Patch(':id')
  async updateUserInfo(
    @Param('id') userId: string,
    @Body() updateUserInfoDto: UpdateUserInfoDto,
  ): Promise<boolean> {
    const res = await this.service.updateInfo(userId, updateUserInfoDto)
    return res.matchedCount === 1
  }

  @Delete(':id')
  async deleteUser(@Param('id') userId: string): Promise<boolean> {
    const res = await this.service.delete(userId)
    return res.deletedCount === 1
  }
}
