import React from 'react';
import { useRouter } from 'next/router';
import { useUser } from '../../../hooks/useUser';
import { useBooksByAuthor } from '../../../hooks/useBooksByAuthor';
import styles from './UserDetail.module.css';

export const UserDetail: React.FC = () => {
  const { query: { id }} = useRouter();
  const { user } = useUser({
    variables: { id: id as string },
  });
  const { books } = useBooksByAuthor({
    variables: { authorId: id as string }
  })

  if (!user) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        User not found...:(
      </div>
    )
  }

  return (
    <div className={styles.userDetailContainer}>
      <div className={styles.userContainer}>
        <h1>{user.name}</h1>
        <p>{user.email}</p>
      </div>
      <div className={styles.bookGrid}>
        {books?.map((book) => (
          <div key={book.id} className={styles.bookCard}>
            <h3>{book.title}</h3>
            <p>Number of pages: {book.numPages}</p>
            <pre className={styles.bookCodeBlock}>
              <code>{JSON.stringify(book, null, 2)}</code>
            </pre>
          </div>
        ))}
      </div>
    </div>
  )
}
