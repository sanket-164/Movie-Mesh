import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "Comedy");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const getInitialFields = () => {
    const activeFields = (searchParams.get("path") || "title").split(",");
    return {
      title: activeFields.includes("title"),
      plot: activeFields.includes("plot"),
      genres: activeFields.includes("genres"),
      cast: activeFields.includes("cast"),
      directors: activeFields.includes("directors"),
      writers: activeFields.includes("writers"),
    };
  };

  const [fields, setFields] = useState(getInitialFields);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const activePaths = Object.keys(fields)
      .filter((key) => fields[key as keyof typeof fields])
      .join(",");

    navigate(
      `search/?q=${encodeURIComponent(query)}&path=${activePaths}&page=1`,
    );
  };

  return (
    <div className="bg-white border-bottom">
      <div className="container py-3">
        <form onSubmit={handleSubmit}>
          {/* Search Row */}
          <div className="row g-2 align-items-center">
            <div className="col-12 col-md-8">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Search movies, actors, directors..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="col-6 col-md-2">
              <button
                type="button"
                className="btn btn-outline-secondary w-100"
                onClick={() => setShowAdvanced((p) => !p)}
              >
                Filters
              </button>
            </div>

            <div className="col-6 col-md-2">
              <button
                type="submit"
                className="btn btn-dark w-100"
                disabled={!query.trim()}
              >
                Search
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvanced && (
            <div className="mt-3 p-3 bg-light rounded">
              <div className="row g-2">
                {Object.entries(fields).map(([field, checked]) => (
                  <div key={field} className="col-6 col-md-4 col-lg-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={field}
                        name={field}
                        checked={checked}
                        onChange={(e) =>
                          setFields((prev) => ({
                            ...prev,
                            [field]: e.target.checked,
                          }))
                        }
                      />
                      <label
                        className="form-check-label text-capitalize small"
                        htmlFor={field}
                      >
                        {field.replace(/s$/, "")}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
