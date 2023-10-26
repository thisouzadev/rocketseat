// eslint-disable-next-line
import { Knex } from 'knex'
// ou faça apenas:
// import 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    diets: {
      id: string
      name: string
      Description: string
      isDiet: false
      created_at: string
      session_id?: string
    }
  }
}
