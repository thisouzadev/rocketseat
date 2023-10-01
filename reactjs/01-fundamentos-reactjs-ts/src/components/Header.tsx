import styles from './Header.module.css'

import ingnitelogo from '../assets/ignite-logo.svg';

export function Header() {
  return (
    <header className={styles.header}>
      <img src={ingnitelogo} alt="logo do ignite" />
      <strong >Ignite Feed</strong>
    </header>
  )
}