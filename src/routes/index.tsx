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

  return <button onClick={handleToggle}>{isFavorite ? '★' : '☆'}</button>;
});

const App = observer(function App() {
  const [bookList, setBookList] = useState<BookListResponse | null>(null);

  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    const books = BookListResponseSchema.safeParse(
      await searchBooks(formData.bookName),
    );
    if (books.success) {
      setBookList(books.data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('bookName', { required: true })} />

      <input type="submit" />
      {bookList && (
        <ul>
          {bookList.books.flat().map((book) => (
            <li key={book.id}>
              <h2>{book.title}</h2>
              {book.subtitle && <h3>{book.subtitle}</h3>}
              <p>
                Authors: {book.authors.map((author) => author.name).join(', ')}
              </p>
              <p>Average Rating: {book.rating.average}</p>
              <FavoriteButton book={book} />
              <img src={book.image} alt={book.title} />
            </li>
          ))}
        </ul>
      )}
    </form>
  );
});

export const Route = createFileRoute('/')({
  component: App,
});
