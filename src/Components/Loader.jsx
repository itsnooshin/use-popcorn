import { ClapSpinner } from "react-spinners-kit";

export const Loader = ({ loading }) => {
  return (
    <div className="loader">
      <ClapSpinner size={50} color="#fff" loading={loading} />
    </div>
  );
};
