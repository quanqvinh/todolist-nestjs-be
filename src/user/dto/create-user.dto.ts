import { BaseUserDto } from './base-user.dto'

export class CreateUserDto extends BaseUserDto {
  email: string
  name: string
}
