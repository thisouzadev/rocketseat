import fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import jwt from 'jsonwebtoken'

// Estenda a interface 'FastifyRequest'
declare module 'fastify' {
  interface FastifyRequest {
    user_id: string // Adicione a propriedade 'user_id'
    id: string
  }
}

export async function authenticateJWT(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const token = request.headers.authorization

  if (!token) {
    reply.status(401).send({ message: 'Acesso não autorizado' })
    return
  }

  jwt.verify(token, 'ChaveSecreta', (err, decoded) => {
    if (err) {
      reply.status(403).send({ message: 'Token inválido' })
      return
    }

    if (decoded === undefined || typeof decoded !== 'object') {
      reply.status(403).send({ message: 'Token inválido' })
      return
    }

    // Verifique se 'userId' existe na carga útil decodificada
    if (decoded.userId && typeof decoded.userId === 'string') {
      // Defina o campo 'user_id' na solicitação
      request.user_id = decoded.userId
    } else {
      // Se 'userId' estiver ausente ou não for uma string, trate o erro
      reply.status(403).send({ message: 'Token inválido' })
    }
  })
}
