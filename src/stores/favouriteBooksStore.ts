import { types } from 'mobx-state-tree';
import type { Instance } from 'mobx-state-tree';

const BookModel = types.model('Book', {
  id: types.number,
  title: types.string,
  subtitle: types.optional(types.string, ''),
  image: types.string,
  authors: types.array(
    types.model('Author', {
      id: types.number,
      name: types.string,
    }),
  ),
  rating: types.model('Rating', {
    average: types.number,
  }),
});

const FavouriteBooksStore = types
  .model('FavouriteBooksStore', {
    books: types.array(BookModel),
  })
  .actions((self) => ({
    addBook(book: Instance<typeof BookModel>) {
      const bookExists = self.books.find((b) => b.id === book.id);
      if (!bookExists) {
        self.books.push(book);
      }
    },
    removeBook(bookId: number) {
      const index = self.books.findIndex((book) => book.id === bookId);
      self.books.splice(index, 1);
    },
  }))
  .views((self) => ({
    isFavouriteBook(bookId: number) {
      return self.books.some((book) => book.id === bookId);
    },
  }));

export const favouriteBooksStore = FavouriteBooksStore.create({
  books: [],
});

export { BookModel };
