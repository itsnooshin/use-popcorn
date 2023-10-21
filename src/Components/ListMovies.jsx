import Movie from "./Movie";

export default function ListMovies({ movies, handleList }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} handleList={handleList} key={movie.imdbID} />
      ))}
    </ul>
  );
}
