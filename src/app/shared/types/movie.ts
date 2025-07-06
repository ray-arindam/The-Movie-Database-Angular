export type Mood = {
  label: string;
  value: string;
};

export type Movie  = {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string; // Use `Date` if you plan to parse it
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};
