import { Header } from './components/Header'
import TodoCreate from './components/TodoCreate'
import styles from './App.module.css';
import './global.css'

function App() {

  return (
    <div>
      <Header />
      <div className={styles.wrapper}>
        <TodoCreate />
      </div>
    </div>
  )
}

export default App
