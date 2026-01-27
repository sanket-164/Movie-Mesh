import { useState } from "react";

const SearchBar = ({
  onSearch,
}: {
  onSearch: (params: { query: string; fields: string[] }) => void;
}) => {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    title: true,
    plot: false,
    cast: false,
    directors: false,
    writers: false,
  });

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const activeFields = Object.keys(filters).filter(
      (key) => filters[key as keyof typeof filters],
    );

    onSearch({
      query,
      fields: activeFields,
    });
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
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="col-12 col-md-4 col-lg-4">
              <div className="d-flex flex-wrap gap-3">
                {Object.keys(filters).map((field) => (
                  <div className="form-check" key={field}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name={field}
                      id={field}
                      checked={filters[field as keyof typeof filters]}
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
              <button className="btn btn-dark w-100">Search</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
