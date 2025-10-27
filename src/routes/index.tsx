import { createFileRoute } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { BookListResponseSchema } from '../types/book.ts';
import { BookCard } from '../components/BookCard.tsx';
import type { SubmitHandler } from 'react-hook-form';
import type { BookListResponse } from '../types/book.ts';

const apiKey = import.meta.env.VITE_API_KEY;

type Inputs = {
  bookName: string;
};

const searchBooks = async (bookName: string) => {
  const response = await fetch(
    `https://api.bigbookapi.com/search-books?api-key=${apiKey}&query=${bookName}`,
  );
  return response.json();
};

const App = observer(function App() {
  const [bookList, setBookList] = useState<BookListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    setIsLoading(true);
    const books = BookListResponseSchema.safeParse(
      await searchBooks(formData.bookName),
    );
    if (books.success) {
      setBookList(books.data);
    }
    setIsLoading(false);
  };

  return (
    <>
      <header className="app-header">
        <h1 className="app-title">📚 Book Finder</h1>
      </header>

      <form className="search-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="search-input-group">
          <input
            className="search-input"
            {...register('bookName', { required: true })}
            placeholder="Search for books..."
            disabled={isLoading}
          />
          <button className="search-button" type="submit" disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {isLoading && (
        <div className="loading">
          <p>🔍 Searching for books...</p>
        </div>
      )}

      {bookList && bookList.books.flat().length > 0 && (
        <ul className="book-list">
          {bookList.books.flat().map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </ul>
      )}

      {bookList && bookList.books.flat().length === 0 && !isLoading && (
        <div className="empty-state">
          <h3>No books found</h3>
          <p>Try searching with different keywords</p>
        </div>
      )}
    </>
  );
});

export const Route = createFileRoute('/')({
  component: App,
});
