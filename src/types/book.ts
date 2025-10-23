interface Author {
  id: number;
  name: string;
}

interface Rating {
  average: number;
}

interface Book {
  id: number;
  title: string;
  subtitle?: string;
  image: string;
  authors: Author[];
  rating: Rating;
}

export interface BookListResponse {
  available: number;
  number: number;
  offset: number;
  books: Book[][];
}
