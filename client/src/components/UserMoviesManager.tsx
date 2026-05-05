import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  addMovie,
  deleteMovie,
  getUserMovies,
  updateMovie,
} from "../api/search.api";
import type { MovieFormPayload, UserMovie, UserMovieResponse } from "../types";
import fallbackImage from "../assets/Movie-Mesh.png";
import MovieForm from "./MovieForm";

const MOVIES_LIMIT = 10;

const UserMoviesManager = () => {
  const [movies, setMovies] = useState<UserMovie[]>([]);
  const [totalMovies, setTotalMovies] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState<UserMovie | null>(null);
  const [error, setError] = useState("");

  const fetchUserMovies = async () => {
    try {
      setLoading(true);
      setError("");
      const response = (await getUserMovies(
        `skip=0&limit=${MOVIES_LIMIT}`,
      )) as UserMovieResponse;

      setMovies(response.movies || []);
      setTotalMovies(response.totalMovies || 0);
    } catch {
      setError("Unable to load your movies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserMovies();
  }, []);

  const handleAddMovie = async (payload: MovieFormPayload) => {
    await addMovie(payload);
    setShowAddForm(false);
    await fetchUserMovies();
  };

  const handleUpdateMovie = async (payload: MovieFormPayload) => {
    if (!editingMovie) return;

    await updateMovie(editingMovie._id, payload);
    setEditingMovie(null);
    await fetchUserMovies();
  };

  const handleDeleteMovie = async (movieId: string) => {
    const confirmed = window.confirm(
      "Delete this movie and your comments for it?",
    );
    if (!confirmed) return;

    try {
      await deleteMovie(movieId);
      setMovies((prev) => prev.filter((movie) => movie._id !== movieId));
      setTotalMovies((prev) => Math.max(0, prev - 1));
    } catch {
      setError("Unable to delete movie right now");
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">My Movies</h2>
          <p className="text-muted mb-0">
            Manage titles you have added to Movie-Mesh
          </p>
        </div>
        <button
          className="btn btn-dark"
          onClick={() => {
            setEditingMovie(null);
            setShowAddForm((prev) => !prev);
          }}
        >
          {showAddForm ? "Close" : "Add Movie"}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {showAddForm && (
        <div className="mb-4">
          <MovieForm
            submitLabel="Create"
            onSubmit={handleAddMovie}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {editingMovie && (
        <div className="mb-4">
          <MovieForm
            initialMovie={editingMovie}
            submitLabel="Update"
            onSubmit={handleUpdateMovie}
            onCancel={() => setEditingMovie(null)}
          />
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Your Library</h5>
        <span className="badge bg-secondary">{totalMovies} total</span>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-secondary" role="status" />
        </div>
      )}

      {!loading && movies.length === 0 && (
        <div className="card border-0 shadow-sm p-4 text-center">
          <p className="text-muted mb-0">You have not added any movies yet.</p>
        </div>
      )}

      {!loading && movies.length > 0 && (
        <div className="row g-4">
          {movies.map((movie) => (
            <div key={movie._id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <img
                  src={movie.poster || fallbackImage}
                  alt={movie.title}
                  className="card-img-top"
                  style={{ aspectRatio: "3 / 4", objectFit: "cover" }}
                  onError={(event) => {
                    event.currentTarget.src = fallbackImage;
                  }}
                />

                <div className="card-body d-flex flex-column">
                  <h6 className="fw-semibold mb-1">{movie.title}</h6>
                  <div className="text-muted small mb-2">
                    {movie.year || "N/A"} • {movie.rated || "Unrated"}
                  </div>
                  <p className="small text-muted flex-grow-1">
                    {movie.plot?.length
                      ? movie.plot.slice(0, 120)
                      : "No synopsis available"}
                  </p>

                  <div className="d-flex flex-wrap gap-2 mt-3">
                    <button
                      className="btn btn-sm btn-outline-dark"
                      onClick={() => setEditingMovie(movie)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteMovie(movie._id)}
                    >
                      Delete
                    </button>
                    <Link
                      to={`/search/${movie._id}`}
                      className="btn btn-sm btn-primary"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserMoviesManager;
