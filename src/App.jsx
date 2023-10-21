import { Children, useEffect, useState } from "react";
import StarRating from "./Components/StarRating";
import { Loader } from "./Components/Loader";
import { Logo } from "./Components/Logo";
import ListMovies from "./Components/ListMovies";
import NumberOfList from "./Components/NumberOfList";
import SummaryWatched from "./Components/SummaryWatched";
import MoviesDetail from "./Components/MoviesDetail";
import HeaderNavbar from "./Components/HeaderNavbar";
import SearchInput from "./Components/SearchInput";
import Box from "./Components/Box";

function App() {
  const [movies, setMovies] = useState([]); //state for all movies
  const [query, setQuery] = useState(""); // state for searach
  const [watched, setWatched] = useState([]); // state for watched
  const [error, setError] = useState(""); // state for error messages
  const [isLoading, setLoading] = useState(false); // state for loading
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  //

  const KEY = "879026be";
  useEffect(
    function () {
      async function fetchMovies() {
        try {
          //
          setLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
          );
          if (!res.ok) {
            throw new Error("Interet connection error");
          }
          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie is not found");
          setMovies(data.Search);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      fetchMovies();
    },
    [query]
  );

  function handleList(id) {
    setSelectedMovieId((selectId) => (id === selectId ? null : id));
    // setSelectedMovieId(id);
    // id === selectId ? null means if no movie is not selected do nothing
  }

  function handleBack() {
    setSelectedMovieId(null);
  }

  function handleAddWatchedMovie(movies) {
    setWatched([...watched, movies]);
    setSelectedMovieId(null);
  }
  function removeList(id) {
    setWatched(watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <HeaderNavbar>
        <Logo />
        <SearchInput query={query} setQuery={setQuery} />
        <NumberOfList movies={movies} />
      </HeaderNavbar>
      <Main movies={movies}>
        <Box>
          {isLoading && <Loader loading={isLoading} />}
          {!isLoading && !error && (
            <ListMovies
              movies={movies}
              clickclick={selectedMovieId}
              handleList={handleList}
            />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedMovieId ? (
            <Overview
              selectedMovieId={selectedMovieId}
              setSelectedMovieId={selectedMovieId}
              movie={movies}
              movies={movies}
              isLoading={isLoading}
              setLoading={setLoading}
              handleBack={handleBack}
              AddWatached={handleAddWatchedMovie}
              watched={watched}
            />
          ) : (
            <>
              <SummaryWatched watched={watched} />
              <MoviesDetail watched={watched} removeList={removeList} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span> {message}
    </p>
  );
}
function Overview({ selectedMovieId, handleBack, AddWatached, watched }) {
  const [movieData, setMovieData] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);

  const isWatched = watched.map((movie) => movie.imdbID);
  const rating = watched.find(
    (movie) => movie.imdbID === selectedMovieId
  )?.userRating;

  const KEY = "879026be";
  useEffect(
    function () {
      async function MovieInformation() {
        setLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedMovieId}`
        );
        const data = await res.json();
        console.log(data);
        setMovieData(data);
        setLoading(false);
      }

      MovieInformation();
    },
    [selectedMovieId]
  );

  function handleRatingChange(newRating) {
    setSelectedRating(newRating);
  }
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
    UserRating: userRating,
  } = movieData;
  function handleAdd() {
    const newMovie = {
      imdbID: selectedMovieId,
      title,
      year,
      poster,

      // userRating: imdbRating,
      userRating: selectedRating,
      imdbRating: Number(imdbRating),
      runtime: parseInt(runtime, 10),
    };
    AddWatached(newMovie);
    // setSelectedRating(selectedRating);
    // setRatedAdd(true);
  }

  return (
    <>
      {" "}
      {isLoading ? (
        <Loader />
      ) : (
        <div className="details">
          <header>
            <button className="btn-back" onClick={handleBack}>
              ←
            </button>
            <img src={movieData.Poster} alt="" />
            <div className="details-overview">
              <h2>{movieData.Title}</h2>
              <p>
                {movieData.Released} .{movieData.Runtime}{" "}
              </p>
              <p>{movieData.Genre}</p>
              <p>
                <span>⭐</span>
                {movieData.imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched.includes(selectedMovieId) ? (
                <>
                  <StarRating
                    size={24}
                    maxRate={10}
                    onRatingChange={handleRatingChange}
                  />

                  {selectedRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>You rated this movie {rating} ⭐ </p>
              )}
            </div>
            <em>{movieData.Plot}</em>
            <p>Starring {movieData.Actors}</p>
            <p>Directed by {movieData.Director} </p>
          </section>
        </div>
      )}
    </>
  );
}

// function SearchInput({ query, setQuery }) {
//   return (
//     <input
//       className="search"
//       type="text"
//       placeholder="Search movies..."
//       value={query}
//       onChange={(e) => setQuery(e.target.value)}
//     />
//   );
// }

function Main({ children }) {
  return <main className="main">{children}</main>;
}

export default App;
