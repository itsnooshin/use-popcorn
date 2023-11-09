import { useEffect, useState, useRef } from 'react';
import { ClapSpinner } from 'react-spinners-kit';
import StarRating from './StarRating';
import useLocalStorageState from './useLocalStorageState';
import useMovies from './useMovies';
import useKeys from './useKeys';

// import { Loader } from './Loader';

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  //state for all movies
  const [query, setQuery] = useState(''); // state for searach
  // const [watched, setWatched] = useState([]); // state for watched
  // state for error messages
  // state for loading

  const { movies, isLoading, error } = useMovies(query);

  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const [watched, setWatched] = useLocalStorageState([], 'watched');

  // useEffect(() => {
  //   const ItemFromStorage = localStorage.getItem('watched');
  //   if (ItemFromStorage) {
  //     setWatched(JSON.parse(ItemFromStorage));
  //   }
  // }, []);
  // add localStorage on my project

  // Functions

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
    // setSelectedMovieId(null);
  }

  function removeList(id) {
    setWatched(watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <Navbar>
        <Logo />
        <SearchInput query={query} setQuery={setQuery} />
        <NumberOfList movies={movies} />
      </Navbar>
      <Main movies={movies}>
        <Box>
          {isLoading && <Loader loading={isLoading} />}
          {!isLoading && !error && (
            <ListMovies
              movies={movies}
              clickclick={selectedMovieId}
              onSelectMovie={handleList}
            />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedMovieId ? (
            <Overview
              selectedMovieId={selectedMovieId}
              isLoading={isLoading}
              // setLoading={setLoading}
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

/*  =====  HeaderNavbar component =====    */

function Navbar({ children }) {
  return (
    <div>
      <nav className="nav-bar">{children}</nav>
    </div>
  );
}

/*  =====  Logo component =====    */

const Logo = () => {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
};

/*  =====  SearchInput component =====    */

function SearchInput({ query, setQuery }) {
  const inputRef = useRef(null);

  // useEffect(() => {
  //   function callBack(e) {
  //     if (document.activeElement === inputRef.current) return;
  //     if (e.code === 'Enter') {
  //       inputRef.current.focus();
  //       setQuery('');
  //     }
  //   }

  //   document.addEventListener('keydown', callBack);

  //   return () => document.addEventListener('keydown', callBack);

  //   // clean up  the effect
  // }, [setQuery]);

  useKeys('Enter', function () {
    if (document.activeElement === inputRef.current) return;
    inputRef.current.focus();
    setQuery('');
  });

  return (
    <input
      className="search"
      type="text"
      ref={inputRef}
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

/*  ******  NumberOfList  component ****    */

function NumberOfList({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

/*  ******  Main  component ****    */

function Main({ children }) {
  return <main className="main">{children}</main>;
}

/*  ******  Box  component ****    */

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? '–' : '+'}
      </button>
      {isOpen && children}
    </div>
  );
}

/* ======= Loader  component ======  */

const Loader = ({ loading }) => {
  return (
    <div className="loader">
      <ClapSpinner size={50} color="#fff" loading={loading} />
    </div>
  );
};

/* ======= ListMovies component ======  */

function ListMovies({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} onSelectMovie={onSelectMovie} key={movie.imdbID} />
      ))}
    </ul>
  );
}

/* ======= Movie  component ======  */

function Movie({ movie, onSelectMovie }) {
  return (
    <li key={movie.imdbID} onClick={() => onSelectMovie(movie.imdbID)}>
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

/* ======= Error message  component ======  */

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span> {message}
    </p>
  );
}

/* ======= Overview component ======  */

function Overview({ selectedMovieId, handleBack, AddWatached, watched }) {
  const [movieData, setMovieData] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);

  const countRef = useRef(0);

  const isWatched = watched.map((movie) => movie.imdbID);
  const rating = watched.find(
    (movie) => movie.imdbID === selectedMovieId,
  )?.userRating;

  const KEY = '879026be';
  useEffect(
    function () {
      async function MovieInformation() {
        setLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedMovieId}`,
        );
        const data = await res.json();

        setMovieData(data);
        setLoading(false);
      }

      MovieInformation();
    },
    [selectedMovieId],
  );
  function handleRatingChange(newRating) {
    setSelectedRating(newRating);
  }

  /* eslint-disable */

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

  useEffect(() => {
    if (selectedRating) countRef.current++;
  }, [selectedRating]);

  function handleAdd() {
    const newMovie = {
      imdbID: selectedMovieId,
      title,
      year,
      poster,
      userRating: selectedRating,
      imdbRating: Number(imdbRating),
      runtime: parseInt(runtime, 10),
      countRating: countRef.current,
    };

    AddWatached(newMovie);
    // setSelectedRating(selectedRating);
    // setRatedAdd(true);
    // setAvrageRating(Number(imdbRating));
    // setAvrageRating((avrageRating) => (avrageRating + selectedRating) / 2);
    // 8.7 + 10 / 2 = 4.5
    // 0 ==> chon inital has 0  + 10 = 10 / 2  === 5
  }

  useKeys('Escape', handleBack);

  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;

    return function () {
      document.title = `usePopcorn`;
    };
  }, [title]);

  return (
    <>
      {' '}
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
                {movieData.Released} .{movieData.Runtime}{' '}
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

// SummaryWatched component

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

// MoviesDetail component

function MoviesDetail({ watched, removeList }) {
  return (
    <ul className="list">
      {watched.map((movie, i) => (
        <ListDetailMovie movie={movie} key={i} id={i} removeList={removeList} />
      ))}
    </ul>
  );
}

// ListDetailMovie  component

function ListDetailMovie({ movie, removeList }) {
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
