import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  BookModel,
  favouriteBooksStore,
} from '../stores/favouriteBooksStore.ts';
import type { Book } from '../types/book.ts';

interface BookCardProps {
  book: Book;
}

const BookImage = ({ src, alt }: { src: string; alt: string }) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      {isLoading && <div className="image-skeleton" />}
      <img
        className={`book-image ${isLoading ? 'loading' : ''}`}
        src={src}
        alt={alt}
        onLoad={handleLoad}
        style={{ position: isLoading ? 'absolute' : 'static', top: 0, left: 0 }}
      />
    </div>
  );
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

export const BookCard = ({ book }: BookCardProps) => {
  return (
    <li className="book-card">
      <FavoriteButton book={book} />
      <div className="book-content">
        <BookImage src={book.image} alt={book.title} />
        <div className="book-info">
          <h2 className="book-title">{book.title}</h2>
          {book.subtitle && <h3 className="book-subtitle">{book.subtitle}</h3>}
          <p className="book-authors">
            <strong>{book.authors.length > 1 ? 'Authors:' : 'Author:'}</strong>{' '}
            {book.authors.map((author) => author.name).join(', ')}
          </p>
          <div className="book-rating">
            <span className="rating-stars">⭐</span>
            <span>
              <strong>Rating:</strong> {(book.rating.average * 5).toFixed(2)}
              /5
            </span>
          </div>
        </div>
      </div>
    </li>
  );
};
