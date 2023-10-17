import http from 'node:http'
import { json } from './middlewares/json.js'
import { routes } from './routes.js'
import { Database } from './database.js'

const database = new Database()

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res)

  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  })
  
  if (route) {
    const routeParams = req.url.match(route.path)

    console.log(routeParams);
    
    return route.handler(req, res)
  }


  return res.end('Hello World')
})

server.listen(3333)