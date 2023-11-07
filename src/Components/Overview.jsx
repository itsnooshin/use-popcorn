import { useEffect, useRef, useState } from 'react';
import StarRating from './StarRating';
import { Loader } from './Loader';

export function Overview({
  selectedMovieId,
  handleBack,
  AddWatached,
  watched,
}) {
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
  // const [isTop, setIsTop] = useState(imdbRating > 8);
  // console.log(isTop);

  // const [avrageRating, setAvrageRating] = useState(0);

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
    console.log(selectedRating);
    // console.log(imdbRating, selectedRating, userRating); // 7.1  , 9

    AddWatached(newMovie);
    // setSelectedRating(selectedRating);
    // setRatedAdd(true);
    // setAvrageRating(Number(imdbRating));
    // setAvrageRating((avrageRating) => (avrageRating + selectedRating) / 2);
    // 8.7 + 10 / 2 = 4.5
    // 0 ==> chon inital has 0  + 10 = 10 / 2  === 5
  }

  useEffect(() => {
    function callBack(event) {
      if (event.code === 'Escape') {
        handleBack();
        console.log('CLOSE');
      }
    }
    document.addEventListener('keydown', callBack);

    return function () {
      document.removeEventListener('keydown', callBack);
    };
  }, [handleBack]);

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
