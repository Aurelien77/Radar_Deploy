import React from "react";
import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <div>
      <p class="not"> La page n'a pas été trouvée </p>
      <p class="not">
        Go to the Home Page: <Link to="/">=> Home Page</Link>
      </p>
    </div>
  );
}

export default PageNotFound;
