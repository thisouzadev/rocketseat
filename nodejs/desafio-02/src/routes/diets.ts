import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'
import { generateToken, verifyPassword } from '../middlewares/auth'
import { authenticateJWT } from '../middlewares/authenticateJWT'

export async function dietsRoutes(app: FastifyInstance) {
  app.post(
    '/create-user',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const createUserBodySchema = z.object({
          username: z.string(),
          password: z.string(),
          email: z.string(),
        })
        const { username, password, email } = createUserBodySchema.parse(
          request.body,
        )

        const existingUser = await knex('users').where({ email }).first()
        if (existingUser) {
          reply
            .status(400)
            .send({ message: 'O email já está em uso por outro usuário' })
          return
        }

        const newUser = await knex('users').insert({
          id: randomUUID(),
          username,
          password,
          email,
        })

        reply
          .status(201)
          .send({ message: 'Usuário criado com sucesso', user: newUser })
      } catch (error) {
        reply
          .status(500)
          .send({ message: 'Erro ao criar o usuário', error: error.message })
      }
    },
  )

  app.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
    const loginSchema = z.object({
      email: z.string(),
      password: z.string(),
    })

    const { email, password } = loginSchema.parse(request.body)

    const user = await knex('users').where({ email }).first()

    if (!user) {
      reply.status(401).send({ message: 'Credenciais inválidas' })
      return
    }

    const isPasswordValid = verifyPassword(password, user.password)

    if (!isPasswordValid) {
      reply.status(401).send({ message: 'Credenciais inválidas' })
      return
    }

    const token = generateToken(user.id)

    reply.send({ token })
  })

  app.post(
    '/meals',
    { preHandler: [authenticateJWT] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const createMealSchema = z.object({
        name: z.string(),
        description: z.string(),
        is_diet_meal: z.boolean(),
      })

      const id = request.user_id

      const { name, description, is_diet_meal } = createMealSchema.parse(
        request.body,
      )

      try {
        const meal = await knex('meals').insert({
          id: randomUUID(),
          name,
          description,
          is_diet_meal,
          user_id: id,
        })

        reply
          .status(201)
          .send({ message: 'Refeição registrada com sucesso', meal })
      } catch (error) {
        reply.status(500).send({
          message: 'Erro ao registrar a refeição',
          error: error.message,
        })
      }
    },
  )
  app.get(
    '/meals',
    { preHandler: [authenticateJWT] },
    async (request, reply) => {
      const id = request.user_id

      try {
        const meals = await knex('meals').where({ user_id: id })

        reply.status(200).send(meals)
      } catch (error) {
        reply.status(500).send({
          message: 'Erro ao buscar refeições',
          error: error.message,
        })
      }
    },
  )

  app.get(
    '/meals/:id',
    { preHandler: [authenticateJWT] },
    async (request, reply) => {
      const userId = request.user_id
      const mealId = request.params.id

      try {
        const meal = await knex('meals')
          .where({ id: mealId, user_id: userId })
          .first()

        if (!meal) {
          reply.status(404).send({ message: 'Refeição não encontrada' })
          return
        }

        reply.status(200).send(meal)
      } catch (error) {
        reply.status(500).send({
          message: 'Erro ao recuperar a refeição',
          error: error.message,
        })
      }
    },
  )

  app.delete(
    '/meals/:id',
    { preHandler: [authenticateJWT] },
    async (request: FastifyRequest, reply) => {
      const id = request.params.id
      const userId = request.user_id

      try {
        const meal = await knex('meals').where({ id, user_id: userId }).del()

        if (meal === 0) {
          reply.status(404).send({ message: 'Refeição não encontrada' })
        } else {
          reply.status(204).send()
        }
      } catch (error) {
        reply.status(500).send({
          message: 'Erro ao excluir a refeição',
          error: error.message,
        })
      }
    },
  )

  app.put(
    '/meals/:id',
    { preHandler: [authenticateJWT] },
    async (request, reply) => {
      const id = request.params.id
      const userId = request.user_id

      const updateMealSchema = z.object({
        name: z.string(),
        description: z.string(),
        is_diet_meal: z.boolean(),
      })

      const { name, description, is_diet_meal } = updateMealSchema.parse(
        request.body,
      )

      try {
        const meal = await knex('meals')
          .where({ id, user_id: userId })
          .update({
            name,
            description,
            is_diet_meal,
            updated_at: knex.raw('CURRENT_TIMESTAMP'),
          })

        if (meal === 0) {
          reply.status(404).send({ message: 'Refeição não encontrada' })
        } else {
          reply.status(200).send({ message: 'Refeição atualizada com sucesso' })
        }
      } catch (error) {
        reply.status(500).send({
          message: 'Erro ao atualizar a refeição',
          error: error.message,
        })
      }
    },
  )

  app.get(
    '/metrics/totalMeals',
    { preHandler: [authenticateJWT] },
    async (request, reply) => {
      const userId = request.user_id

      try {
        const totalMeals = await knex('meals')
          .where({ user_id: userId })
          .count()

        reply.status(200).send({ totalMeals })
      } catch (error) {
        reply.status(500).send({
          message:
            'Erro ao recuperar a quantidade total de refeições registradas',
          error: error.message,
        })
      }
    },
  )

  app.get(
    '/metrics/dietMeals',
    { preHandler: [authenticateJWT] },
    async (request, reply) => {
      const userId = request.user_id

      try {
        const dietMeals = await knex('meals')
          .where({ user_id: userId, is_diet_meal: true })
          .count()

        reply.status(200).send({ dietMeals })
      } catch (error) {
        reply.status(500).send({
          message:
            'Erro ao recuperar a quantidade total de refeições dentro da dieta',
          error: error.message,
        })
      }
    },
  )

  app.get(
    '/metrics/nonDietMeals',
    { preHandler: [authenticateJWT] },
    async (request, reply) => {
      const userId = request.user_id

      try {
        const nonDietMeals = await knex('meals')
          .where({ user_id: userId, is_diet_meal: false })
          .count()

        reply.status(200).send({ nonDietMeals })
      } catch (error) {
        reply.status(500).send({
          message:
            'Erro ao recuperar a quantidade total de refeições fora da dieta',
          error: error.message,
        })
      }
    },
  )
}
