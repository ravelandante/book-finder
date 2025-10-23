import { createFileRoute } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
import type { BookListResponse } from '../types/book.ts';

const apiKey = import.meta.env.VITE_API_KEY;

export const Route = createFileRoute('/')({
  component: App,
});

type Inputs = {
  bookName: string;
};

const searchBooks = async (bookName: string) => {
  const response = await fetch(
    `https://api.bigbookapi.com/search-books?api-key=${apiKey}&query=${bookName}`,
  );
  return response.json();
};

function App() {
  const [bookList, setBookList] = useState<BookListResponse | null>(null);

  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    const books = await searchBooks(formData.bookName);
    setBookList(books);
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
              <img src={book.image} alt={book.title} />
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
