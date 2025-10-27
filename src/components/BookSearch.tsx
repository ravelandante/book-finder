import { useForm } from 'react-hook-form';
import { BookListResponseSchema } from '../types/book.ts';
import type { SubmitHandler } from 'react-hook-form';
import type { BookListResponse } from '../types/book.ts';
import type { Dispatch, SetStateAction } from 'react';

interface BookCardProps {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setBookList: Dispatch<SetStateAction<BookListResponse | null>>;
}

type Inputs = {
  bookName: string;
};

const apiKey = import.meta.env.VITE_API_KEY;

const searchBooks = async (bookName: string) => {
  const response = await fetch(
    `https://api.bigbookapi.com/search-books?api-key=${apiKey}&query=${bookName}`,
  );
  return response.json();
};

export const BookSearch = ({
  isLoading,
  setIsLoading,
  setBookList,
}: BookCardProps) => {
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
  );
};
