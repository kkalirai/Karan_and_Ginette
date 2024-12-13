// components/Navbar.js
import Link from 'next/link';

import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <div className={styles.navbar}>
      <h1>My App</h1>
      <div className={styles.links}>
        <Link href="/">Home</Link>
        <Link href="/profile">Profile</Link>
        <Link href="/settings">Settings</Link>
      </div>
    </div>
  );
}
