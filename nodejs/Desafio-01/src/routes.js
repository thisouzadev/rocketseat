import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      const task = database.selectId('tasks', id);
  
      if (!task) {
        return res.writeHead(404).end();
      }
  
      return res.end(JSON.stringify(task));
    }
  },

  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query
      const tasks = database.select('tasks', search ? {
        title: search,
        description: search
      } : null)

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body
      if (!title || !description || title.trim() === '' || description.trim() === '') {
        const errorMessage = "Título e Descrição são campos obrigatórios"
        return res.writeHead(400).end(
          JSON.stringify({ message: errorMessage })
        )
      }

      const tasks = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      }

      database.insert('tasks', tasks)

      return res.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body


    const existingTask = database.selectId('tasks', id);

    if (!existingTask) {
      return res.writeHead(404).end(); // Tarefa não encontrada
    }
    console.log(existingTask.created_at);
      if (!title || !description || title.trim() === '' || description.trim() === '') {
        const errorMessage = "Título e Descrição são campos obrigatórios"
        return res.writeHead(400).end(
          JSON.stringify({ message: errorMessage })
        )
      }

      database.update('tasks', id, {
        title,
        description,
        completed_at: existingTask.completed_at,
        created_at: existingTask.created_at,
        updated_at: new Date()
      })

      return res.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      database.delete('tasks', id)

      return res.writeHead(204).end()
    }
  }
]
