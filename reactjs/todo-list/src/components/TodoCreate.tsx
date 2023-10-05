import React, { ChangeEvent, FormEvent, useState } from 'react'
import Todo from './Todo';
import { Button, Form } from 'react-bootstrap';

interface TodoList {
  content: string,
  isComplete: boolean
}
function TodoCreate() {
  const [todoList, setTodoList] = useState<TodoList[]>([{
    content: 'estudar',
    isComplete: false
  }]);
  const [newTodo, setNewTodo] = useState<string>('');
  function handleCreateNewTodo(event: FormEvent) {
    event.preventDefault()

    setTodoList([...todoList, { content: newTodo, isComplete: false }]);
    setNewTodo('');
  }
  
  function handleNewTodoChange(event: ChangeEvent<HTMLInputElement>) {
    setNewTodo(event.target.value);
  }

  function deleteTodo(todoToDelete: string) {
    const todoWithoutDeletedOne = todoList.filter(todo => {
      return todo.content !== todoToDelete;
    })

    setTodoList(todoWithoutDeletedOne);
  }
  function handleTodoComplete (key: number, isChecked: boolean) {
    const updatedTodos = [...todoList];
    updatedTodos[key].isComplete=isChecked;
    setTodoList(updatedTodos);
  }
  const completedCount = todoList.filter((todo) => todo.isComplete).length;

  return (
    <div>
      <section className="d-flex justify-content-center align-items-center mb-5" >
        <Form className="d-flex" onSubmit={handleCreateNewTodo} action="">
          <Form.Group >
            <Form.Control
              type="text"
              name="todo"
              value={newTodo}
              onChange={handleNewTodoChange}
              placeholder="Adicione uma nova tarefa"
              required
            />
          </Form.Group>
          <Button type="submit" className="btn btn-primary ml-2">Criar tarefa</Button>
        </Form>
      </section>
      <div className='d-flex flex-column '>

        <div className='d-flex  justify-content-around'>
          <p>Tarefas criadas: {todoList.length}</p>
          <p>Tarefas concluídas: {completedCount}</p>
        </div>
        <main>
          {todoList.map((todo, index)=> {
            return (
              <Todo
                key={index}
                content={todo.content}
                onDeleteTodo={deleteTodo}
                onCompleteTodo={(isChecked) => handleTodoComplete(index, isChecked)}
                todoKey={index}
        
              />
            )
          })}
        </main>
      </div>
    </div>

  )
}

export default TodoCreate