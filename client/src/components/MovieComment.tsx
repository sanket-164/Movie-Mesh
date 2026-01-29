import { useEffect, useState, useRef } from "react";
import { getMovieComments } from "../api/search.api";

type Comment = {
  _id: string;
  name: string;
  email: string;
  text: string;
  date: string;
};

type Props = {
  movieId: string;
};

const COMMENTS_LIMIT = 5;

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Unknown date";
  }
};

const MovieComments = ({ movieId }: Props) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  const isResetting = useRef(false);

  useEffect(() => {
    if (!movieId) return;

    // prevent double fetch during reset
    if (isResetting.current) {
      isResetting.current = false;
      return;
    }

    const fetchComments = async () => {
      setLoading(true);
      try {
        const skip = (page - 1) * COMMENTS_LIMIT;
        const response = await getMovieComments(
          movieId,
          `skip=${skip}&limit=${COMMENTS_LIMIT}`,
        );

        setComments((prev) => [...prev, ...response]);
        setHasMore(response.length === COMMENTS_LIMIT);
        setInitialLoad(false);
      } catch (error) {
        console.error("Failed to load comments:", error);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [movieId, page]);

  useEffect(() => {
    isResetting.current = true;
    setComments([]);
    setPage(1);
    setHasMore(true);
    setInitialLoad(true);
  }, [movieId]);

  return (
    <div className="pt-4">
      {/* Initial loading state */}
      {initialLoad && loading && (
        <div className="text-center py-4">
          <div className="spinner-border text-muted" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-2 small">
            Fetching audience perspectives...
          </p>
        </div>
      )}

      {/* Empty state */}
      {!initialLoad && comments.length === 0 && !loading && (
        <div className="text-center py-4 rounded-3">
          <div className="mb-2">🎬</div>
          <p className="text-muted mb-0">No reviews yet.</p>
        </div>
      )}

      {/* Comments list */}
      <div className="row g-3">
        {comments.map((comment) => (
          <div key={comment._id} className="col-12">
            <div className="p-3 bg-white border rounded-3 shadow-sm h-100">
              <div className="d-flex justify-content-between mb-2">
                <div>
                  <div className="fw-semibold">{comment.name}</div>
                  <div className="text-muted small">
                    {formatDate(comment.date)}
                  </div>
                </div>
                <div className="badge bg-primary rounded-pill align-self-start px-3 py-1">
                  Verified
                </div>
              </div>
              <p
                className="mb-0 text-muted lh-base"
                style={{ whiteSpace: "pre-line", opacity: 0.9 }}
              >
                {comment.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer actions */}
      <div className="text-center mt-4">
        {loading && page > 1 && (
          <div className="d-inline-flex align-items-center text-muted small mb-2">
            <div
              className="spinner-border spinner-border-sm me-2"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            Loading more reviews...
          </div>
        )}

        {hasMore && !loading && (
          <button
            className="btn btn-outline-primary px-4 py-2 rounded-pill fw-medium"
            onClick={() => setPage((p) => p + 1)}
            aria-label="Load more comments"
          >
            <span className="d-flex align-items-center justify-content-center">
              More reviews
            </span>
          </button>
        )}

        {!hasMore && comments.length > 0 && (
          <p className="text-muted small mt-2">
            <span className="d-flex align-items-center justify-content-center">
              <svg
                width="16"
                height="16"
                fill="currentColor"
                className="me-1 text-success"
                viewBox="0 0 16 16"
              >
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
              </svg>
              All audience reviews displayed
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default MovieComments;
