import { Children, useEffect, useState } from "react";
import { ClapSpinner } from "react-spinners-kit";
import StarRating from "./StarRating";
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

function App() {
  const [movies, setMovies] = useState([]); //state for all movies
  const [query, setQuery] = useState(""); // state for searach
  const [watched, setWatched] = useState([]); // state for watched
  const [error, setError] = useState(""); // state for error messages
  const [isLoading, setLoading] = useState(false); // state for loading
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const [isSelectedMovie, setSelectedMovie] = useState(false);

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
  function removeList(id){
    setWatched(watched.filter(movie => movie.imdbID !== id));
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
              isSelectedMovie={isSelectedMovie}
            />
          ) : (
            <>
              <SummaryWatched watched={watched} />
              <MoviesDetail watched={watched} removeList  ={removeList}/>
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
function Overview({
  selectedMovieId,
  handleBack,
  AddWatached,
  watched ,
}) {
  const [selectedRating, setSelectedRating] = useState(0);
  const [movieData, setMovieData] = useState({});
  const [isLoading, setLoading] = useState(false);


  const isWatched = watched.map(movie => movie.imdbID);
  const rating = watched.find((movie) => movie.imdbID === selectedMovieId)?.userRating;
 

  const KEY = "879026be";
  useEffect(
    function () {
      async function MovieInformation() {
        setLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedMovieId}`
        );
        const data = await res.json();
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

function Loader({ loading }) {
  return (
    <div className="loader">
      <ClapSpinner size={50} color="#fff" loading={loading} />
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span> {message}
    </p>
  );
}
// split compoenent
function HeaderNavbar({ children }) {
  return (
    <div>
      <nav className="nav-bar">{children}</nav>
    </div>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function NumberOfList({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}
function SearchInput({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function Main({ children }) {
  return (
    <main className="main">
      {/* <ListBox movies={movies} />
      <WatchedBox /> */}
      {children}
    </main>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}
function ListMovies({ movies, handleList }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} handleList={handleList} key={movie.imdbID} />
      ))}
    </ul>
  );
}
function Movie({ movie, handleList }) {
  return (
    <li key={movie.imdbID} onClick={() => handleList(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function SummaryWatched({ watched }) {
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      
      </div>
    </div>
  );
}

function MoviesDetail({ watched , removeList }) {
  return (
    <ul className="list">
      {watched.map((movie, i) => (
        <ListDetailMovie movie={movie} key={i}  id = {i} removeList ={removeList}/>
      ))}
    </ul>
  );
}
function ListDetailMovie({ movie , removeList}) {
   console.log(movie);
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button className="btn-delete" onClick={() => removeList(movie.imdbID)}>
          X
        </button>
      </div>
    </li>
  );
}
export default App;
