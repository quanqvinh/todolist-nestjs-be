import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as session from 'express-session'
import * as passport from 'passport'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  )
  app.use(passport.authenticate('session'))
  app.use(passport.initialize())
  app.use(passport.session())
  await app.listen(process.env.PORT || 3000)
  console.log(await app.getUrl())
}
bootstrap()
