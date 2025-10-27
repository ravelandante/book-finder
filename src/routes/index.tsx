import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { BookCard } from '../components/BookCard.tsx';
import { BookSearch } from '../components/BookSearch.tsx';
import type { BookListResponse } from '../types/book.ts';

const App = observer(function App() {
  const [bookList, setBookList] = useState<BookListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <header className="app-header">
        <h1 className="app-title">📚 Book Finder</h1>
      </header>

      <BookSearch
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setBookList={setBookList}
      />

      {isLoading ? (
        <div className="loading">
          <p>🔍 Searching for books...</p>
        </div>
      ) : bookList && bookList.books.flat().length > 0 ? (
        <ul className="book-list">
          {bookList.books.flat().map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </ul>
      ) : (
        bookList && (
          <div className="empty-state">
            <h3>No books found</h3>
            <p>Try searching with different keywords</p>
          </div>
        )
      )}
    </>
  );
});

export const Route = createFileRoute('/')({
  component: App,
});
