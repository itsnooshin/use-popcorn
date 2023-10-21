import ListDetailMovie from "./ListDetailMovie";

export default function MoviesDetail({ watched, removeList }) {
  return (
    <ul className="list">
      {watched.map((movie, i) => (
        <ListDetailMovie movie={movie} key={i} id={i} removeList={removeList} />
      ))}
    </ul>
  );
}
