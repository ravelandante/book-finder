import { createFileRoute } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { BookListResponseSchema } from '../types/book.ts';
import {
  BookModel,
  favouriteBooksStore,
} from '../stores/favouriteBooksStore.ts';
import type { SubmitHandler } from 'react-hook-form';
import type { Book, BookListResponse } from '../types/book.ts';

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

const FavoriteButton = observer(function FavoriteButton({
  book,
}: {
  book: Book;
}) {
  const isFavorite = favouriteBooksStore.isFavouriteBook(book.id);

  const handleToggle = () => {
    if (isFavorite) {
      favouriteBooksStore.removeBook(book.id);
    } else {
      const bookInstance = BookModel.create({
        ...book,
        subtitle: book.subtitle || '',
      });
      favouriteBooksStore.addBook(bookInstance);
    }
  };

  return (
    <button
      className={`favorite-button ${isFavorite ? 'favorited' : ''}`}
      onClick={handleToggle}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isFavorite ? '★' : '☆'}
    </button>
  );
});

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
            <li key={book.id} className="book-card">
              <FavoriteButton book={book} />
              <div className="book-content">
                <img className="book-image" src={book.image} alt={book.title} />
                <div className="book-info">
                  <h2 className="book-title">{book.title}</h2>
                  {book.subtitle && (
                    <h3 className="book-subtitle">{book.subtitle}</h3>
                  )}
                  <p className="book-authors">
                    <strong>
                      {book.authors.length > 1 ? 'Authors:' : 'Author:'}
                    </strong>{' '}
                    {book.authors.map((author) => author.name).join(', ')}
                  </p>
                  <div className="book-rating">
                    <span className="rating-stars">⭐</span>
                    <span>
                      <strong>Rating:</strong>{' '}
                      {(book.rating.average * 5).toFixed(2)}
                      /5
                    </span>
                  </div>
                </div>
              </div>
            </li>
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
