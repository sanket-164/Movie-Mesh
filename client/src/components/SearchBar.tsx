import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const activeFields = (searchParams.get("path") || "title").split(",");

  const [fields, setFields] = useState({
    title: activeFields.includes("title"),
    plot: activeFields.includes("plot"),
    genres: activeFields.includes("genres"),
    cast: activeFields.includes("cast"),
    directors: activeFields.includes("directors"),
    writers: activeFields.includes("writers"),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({
      ...fields,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(
      `/?q=${encodeURIComponent(query)}&path=${Object.keys(fields)
        .filter((field) => fields[field as keyof typeof fields])
        .join(",")}&page=1`,
    );
  };

  return (
    <div className="bg-white border-bottom">
      <div className="container py-3">
        <form onSubmit={handleSubmit}>
          <div className="row align-items-center g-3">
            {/* Search Input */}
            <div className="col-12 col-md-6 col-lg-7">
              <input
                type="text"
                className="form-control"
                placeholder="Search movies..."
                value={query}
                onChange={(e) => {
                  handleInputChange(e);
                }}
              />
            </div>

            {/* Fields */}
            <div className="col-12 col-md-4 col-lg-4">
              <div className="d-flex flex-wrap gap-3">
                {Object.keys(fields).map((field) => (
                  <div className="form-check" key={field}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name={field}
                      id={field}
                      checked={fields[field as keyof typeof fields]}
                      onChange={handleCheckboxChange}
                    />
                    <label
                      className="form-check-label small text-capitalize"
                      htmlFor={field}
                    >
                      {field}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Search Button */}
            <div className="col-12 col-md-2 col-lg-1">
              <button
                className="btn btn-dark w-100"
                disabled={
                  query.trim() === "" ||
                  !Object.values(fields).some((value) => value)
                }
              >
                Search
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
