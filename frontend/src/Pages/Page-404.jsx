import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <p className="not-found-page_title">Page Not Found </p>
      <Link to={"/"}>
        <div>
          Go Back to <span>🏠</span>
        </div>
      </Link>
    </div>
  );
};
