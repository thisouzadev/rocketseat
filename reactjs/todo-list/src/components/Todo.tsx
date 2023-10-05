import React, { ChangeEvent, useState } from 'react';
import { Trash } from 'phosphor-react';
import { Button, Form } from 'react-bootstrap';
import styles from './Todo.module.css'

interface TodoProps {
  content: string;
  onDeleteTodo: (todo: string) => void;
  onCompleteTodo: (isChecked: boolean, index: number) => void;
  todoKey: number;
}

function Todo({ content, onDeleteTodo, onCompleteTodo, todoKey}: TodoProps) {
  const [checkboxTodo, setCheckboxTodo] = useState(false)
  function handleDeleteTodo() {
    onDeleteTodo(content);
  }

  const handleTodoComplete = (event: ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setCheckboxTodo(isChecked)
    onCompleteTodo(isChecked, todoKey)
  };
  console.log(todoKey);
  
  return (
    <main className={"d-flex justify-content-between align-items-center p-2 border rounded mb-3"+ styles.todo} style={{ maxWidth: "50%" }}>
      <Form.Check
        checked={checkboxTodo}
        aria-label="option 1"
        onChange={handleTodoComplete} 
      />
      <p className={'mb-0 text-truncate ' + (checkboxTodo && 'text-decoration-line-through')}>{content}</p>
      <Button
        variant="danger"
        onClick={handleDeleteTodo}
        title="Deletar tarefa"
        className="ml-2"
      >
        <Trash size={20} />
      </Button>
    </main>
  );
}

export default Todo;
