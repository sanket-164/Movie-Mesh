import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Logo from "../assets/Movie-Mesh-Logo.png";
import { getSearchSuggestions } from "../api/search.api";
import type { Suggestion } from "../types";
import fallbackImage from "../assets/Movie-Mesh.png";

const SEARCH_SUGGESTION_LIMIT = 5;

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await getSearchSuggestions(
        `q=${encodeURIComponent(value)}&limit=${SEARCH_SUGGESTION_LIMIT}`,
      );

      setSuggestions(response || []);
      setShowSuggestions(true);
    } catch (err) {
      console.error(err);
      setSuggestions([]);
    }
  };

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <div className="bg-white border-bottom">
      <div className="container py-3">
        <form onSubmit={handleSubmit}>
          <div className="row g-2 align-items-center">
            {/* Logo + Search */}
            <div className="col-12 col-md d-flex align-items-center gap-2">
              <img
                src={Logo}
                alt="Movie-Mesh"
                height={40}
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/")}
              />

              <div className="col-12 col-md d-flex align-items-center gap-2 position-relative">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Search movies, actors, directors..."
                  value={query}
                  onChange={handleInputChange}
                  onClick={() => {
                    handleInputChange({
                      target: { value: query },
                    } as React.ChangeEvent<HTMLInputElement>);
                  }}
                  onBlur={() => {
                    // Delay hiding suggestions to allow click event to register
                    setTimeout(() => setShowSuggestions(false), 250);
                  }}
                />

                {showSuggestions && suggestions.length > 0 && (
                  <ul
                    className="list-group position-absolute w-100 shadow "
                    style={{
                      top: "100%",
                      zIndex: 1000,
                      maxHeight: "300px",
                      overflowY: "auto",
                    }}
                  >
                    {suggestions.map((movie) => (
                      <li
                        key={movie._id}
                        className="list-group-item list-group-item-action d-flex align-items-center gap-3"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setQuery(movie.title);
                          setShowSuggestions(false);
                          navigate(
                            `/movie/${movie._id}?q=${encodeURIComponent(movie.title)}`,
                          );
                        }}
                      >
                        <img
                          src={movie.poster || fallbackImage}
                          alt={movie.title}
                          width={40}
                          height={60}
                          style={{ objectFit: "cover" }}
                          onError={(e) => {
                            e.currentTarget.src = fallbackImage;
                          }}
                        />
                        <div className="d-flex flex-column">
                          <span className="fw-semibold">{movie.title}</span>
                          <span className="text-muted">{movie.year} film</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Filters */}
            <div className="col-6 col-md-2">
              <button
                type="button"
                className="btn btn-outline-secondary w-100"
                onClick={() => setShowAdvanced((p) => !p)}
              >
                Filters
              </button>
            </div>

            {/* Search */}
            <div className="col-6 col-md-2">
              <button
                type="submit"
                className="btn btn-dark w-100"
                disabled={
                  !query.trim() || Object.values(fields).every((v) => !v)
                }
              >
                Search
              </button>
            </div>

            {/* Logout */}
            <div className="col-12 col-md-auto">
              <button
                type="button"
                className="btn btn-outline-danger w-100"
                onClick={handleLogout}
              >
                Logout
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
