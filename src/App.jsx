import { Children, useEffect, useState } from "react";
import { Loader } from "./Components/Loader";
import { Logo } from "./Components/Logo";
import ListMovies from "./Components/ListMovies";
import NumberOfList from "./Components/NumberOfList";
import SummaryWatched from "./Components/SummaryWatched";
import MoviesDetail from "./Components/MoviesDetail";
import HeaderNavbar from "./Components/HeaderNavbar";
import SearchInput from "./Components/SearchInput";
import Box from "./Components/Box";
import { Overview } from "./Components/Overview";
import { ErrorMessage } from "./Components/ErrorMessage";
import { Main } from "./Components/Main";

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
export default App;
