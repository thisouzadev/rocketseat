import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { dietsRoutes } from './routes/diets'

export const app = fastify()

app.register(cookie)

app.register(dietsRoutes, {
  prefix: 'diets',
})
