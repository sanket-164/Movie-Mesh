import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  addComment,
  deleteComment,
  getMovieComments,
  updateComment,
} from "../api/search.api";
import type { MovieCommentType } from "../types";

type Props = {
  movieId: string;
};

const COMMENTS_LIMIT = 5;

const getCurrentUserId = () => {
  try {
    const token =
      sessionStorage.getItem("token") || localStorage.getItem("token");
    if (!token) return null;

    const payload = token.split(".")[1];
    if (!payload) return null;

    const decoded = JSON.parse(atob(payload)) as { id?: number };
    return typeof decoded.id === "number" ? decoded.id : null;
  } catch {
    return null;
  }
};

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
  const [comments, setComments] = useState<MovieCommentType[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [draftComment, setDraftComment] = useState("");
  const [draftName, setDraftName] = useState("");
  const [draftEmail, setDraftEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [actionError, setActionError] = useState("");

  const currentUserId = useMemo(() => getCurrentUserId(), []);

  const fetchComments = async (nextPage: number, append: boolean) => {
    setLoading(true);
    setActionError("");

    try {
      const skip = (nextPage - 1) * COMMENTS_LIMIT;
      const response = (await getMovieComments(
        movieId,
        `skip=${skip}&limit=${COMMENTS_LIMIT}`,
      )) as MovieCommentType[];

      setComments((prev) => (append ? [...prev, ...response] : response));
      setHasMore(response.length === COMMENTS_LIMIT);
    } catch (error) {
      console.error("Failed to load comments:", error);
      setHasMore(false);
      setActionError("Unable to fetch comments right now");
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    if (!movieId) return;

    setComments([]);
    setPage(1);
    setHasMore(true);
    setInitialLoad(true);
    fetchComments(1, false);
  }, [movieId]);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchComments(nextPage, true);
  };

  const handleAddComment = async (event: FormEvent) => {
    event.preventDefault();

    if (!draftComment.trim()) {
      setActionError("Comment cannot be empty");
      return;
    }

    try {
      setSubmitting(true);
      setActionError("");

      await addComment(movieId, {
        text: draftComment.trim(),
        name: draftName.trim() || undefined,
        email: draftEmail.trim() || undefined,
      });

      setDraftComment("");
      await fetchComments(1, false);
      setPage(1);
    } catch (error) {
      console.error("Failed to add comment:", error);
      setActionError("Unable to add comment right now");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditStart = (comment: MovieCommentType) => {
    setActionError("");
    setEditingCommentId(comment._id);
    setEditingText(comment.text);
  };

  const handleUpdateComment = async (commentId: string) => {
    if (!editingText.trim()) {
      setActionError("Comment cannot be empty");
      return;
    }

    try {
      setActionError("");
      await updateComment(commentId, { text: editingText.trim() });

      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                text: editingText.trim(),
                date: new Date().toISOString(),
              }
            : comment,
        ),
      );

      setEditingCommentId(null);
      setEditingText("");
    } catch (error) {
      console.error("Failed to update comment:", error);
      setActionError("Unable to update comment right now");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const confirmed = window.confirm("Delete this comment?");
    if (!confirmed) return;

    try {
      setActionError("");
      await deleteComment(commentId);
      setComments((prev) =>
        prev.filter((comment) => comment._id !== commentId),
      );
    } catch (error) {
      console.error("Failed to delete comment:", error);
      setActionError("Unable to delete comment right now");
    }
  };

  return (
    <div className="pt-4">
      <form
        onSubmit={handleAddComment}
        className="card border-0 shadow-sm p-3 mb-4"
      >
        <h6 className="fw-semibold mb-3">Write a review</h6>
        <div className="row g-2 mb-2">
          <div className="col-12 col-md-6">
            <input
              className="form-control"
              placeholder="Name (optional)"
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
            />
          </div>
          <div className="col-12 col-md-6">
            <input
              className="form-control"
              placeholder="Email (optional)"
              value={draftEmail}
              onChange={(event) => setDraftEmail(event.target.value)}
            />
          </div>
        </div>

        <textarea
          className="form-control mb-3"
          rows={3}
          placeholder="Share your thoughts about this movie"
          value={draftComment}
          onChange={(event) => setDraftComment(event.target.value)}
        />

        <div className="d-flex justify-content-end">
          <button className="btn btn-dark" type="submit" disabled={submitting}>
            {submitting ? "Posting..." : "Post Review"}
          </button>
        </div>
      </form>

      {actionError && (
        <div className="alert alert-danger py-2" role="alert">
          {actionError}
        </div>
      )}

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
                  <div className="fw-semibold">
                    {comment.name || "Anonymous"}
                  </div>
                  <div className="text-muted small">
                    {formatDate(comment.date)}
                  </div>
                </div>
                <div className="badge bg-primary rounded-pill align-self-start px-3 py-1">
                  Verified
                </div>
              </div>

              {editingCommentId === comment._id ? (
                <>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={editingText}
                    onChange={(event) => setEditingText(event.target.value)}
                  />
                  <div className="d-flex gap-2 justify-content-end mt-2">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => {
                        setEditingCommentId(null);
                        setEditingText("");
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-sm btn-dark"
                      onClick={() => handleUpdateComment(comment._id)}
                    >
                      Save
                    </button>
                  </div>
                </>
              ) : (
                <p
                  className="mb-0 text-muted lh-base"
                  style={{ whiteSpace: "pre-line", opacity: 0.9 }}
                >
                  {comment.text}
                </p>
              )}

              {comment.user_id !== undefined &&
                currentUserId === comment.user_id &&
                editingCommentId !== comment._id && (
                  <div className="d-flex gap-2 mt-3 justify-content-end">
                    <button
                      className="btn btn-sm btn-outline-dark"
                      onClick={() => handleEditStart(comment)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteComment(comment._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
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
            onClick={loadMore}
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
