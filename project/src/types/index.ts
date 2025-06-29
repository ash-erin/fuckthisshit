export interface Movie {
  id: string;
  title: string;
  description: string;
  genre: string[];
  year: number;
  rating: string;
  duration: string;
  thumbnail: string;
  backdrop: string;
  videoUrl: string;
  trailerUrl: string;
  isFeatured?: boolean;
  isInMyList?: boolean;
  likes?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  myList: string[];
}

export interface ContentRow {
  id: string;
  title: string;
  movies: Movie[];
}