import { useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { MovieFormPayload, UserMovie } from "../types";

type MovieFormProps = {
  initialMovie?: Partial<UserMovie>;
  submitLabel: string;
  onSubmit: (payload: MovieFormPayload) => Promise<void>;
  onCancel?: () => void;
};

type FormState = {
  title: string;
  plot: string;
  fullplot: string;
  poster: string;
  year: string;
  runtime: string;
  rated: string;
  genres: string;
  languages: string;
  countries: string;
  cast: string;
  directors: string;
  writers: string;
};

const toCsv = (value?: string[]) =>
  value && value.length ? value.join(", ") : "";

const normalizeList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const MovieForm = ({
  initialMovie,
  submitLabel,
  onSubmit,
  onCancel,
}: MovieFormProps) => {
  const initialState = useMemo<FormState>(
    () => ({
      title: initialMovie?.title ?? "",
      plot: initialMovie?.plot ?? "",
      fullplot: initialMovie?.fullplot ?? "",
      poster: initialMovie?.poster ?? "",
      year: initialMovie?.year ? String(initialMovie.year) : "",
      runtime: initialMovie?.runtime ? String(initialMovie.runtime) : "",
      rated: initialMovie?.rated ?? "",
      genres: toCsv(initialMovie?.genres),
      languages: toCsv(initialMovie?.languages),
      countries: toCsv(initialMovie?.countries),
      cast: toCsv(initialMovie?.cast),
      directors: toCsv(initialMovie?.directors),
      writers: toCsv(initialMovie?.writers),
    }),
    [initialMovie],
  );

  const [formData, setFormData] = useState<FormState>(initialState);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange =
    (field: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setError("");
      setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    const payload: MovieFormPayload = {
      title: formData.title.trim(),
    };

    if (formData.plot.trim()) payload.plot = formData.plot.trim();
    if (formData.fullplot.trim()) payload.fullplot = formData.fullplot.trim();
    if (formData.poster.trim()) payload.poster = formData.poster.trim();
    if (formData.rated.trim()) payload.rated = formData.rated.trim();

    if (formData.year.trim()) {
      const year = Number(formData.year);
      if (!Number.isNaN(year)) payload.year = year;
    }

    if (formData.runtime.trim()) {
      const runtime = Number(formData.runtime);
      if (!Number.isNaN(runtime)) payload.runtime = runtime;
    }

    const genres = normalizeList(formData.genres);
    const languages = normalizeList(formData.languages);
    const countries = normalizeList(formData.countries);
    const cast = normalizeList(formData.cast);
    const directors = normalizeList(formData.directors);
    const writers = normalizeList(formData.writers);

    if (genres.length) payload.genres = genres;
    if (languages.length) payload.languages = languages;
    if (countries.length) payload.countries = countries;
    if (cast.length) payload.cast = cast;
    if (directors.length) payload.directors = directors;
    if (writers.length) payload.writers = writers;

    try {
      setSaving(true);
      await onSubmit(payload);
      setFormData(initialState);
    } catch {
      setError("Unable to save movie right now");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card border-0 shadow-sm p-3 p-md-4"
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0 fw-semibold">{submitLabel} Movie</h5>
        {onCancel && (
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="row g-3">
        <div className="col-12 col-md-8">
          <label className="form-label small">Title</label>
          <input
            className="form-control"
            value={formData.title}
            onChange={handleChange("title")}
          />
        </div>
        <div className="col-6 col-md-2">
          <label className="form-label small">Year</label>
          <input
            className="form-control"
            value={formData.year}
            onChange={handleChange("year")}
          />
        </div>
        <div className="col-6 col-md-2">
          <label className="form-label small">Runtime</label>
          <input
            className="form-control"
            value={formData.runtime}
            onChange={handleChange("runtime")}
          />
        </div>

        <div className="col-12">
          <label className="form-label small">Poster URL</label>
          <input
            className="form-control"
            value={formData.poster}
            onChange={handleChange("poster")}
          />
        </div>

        <div className="col-12">
          <label className="form-label small">Plot</label>
          <textarea
            className="form-control"
            rows={2}
            value={formData.plot}
            onChange={handleChange("plot")}
          />
        </div>

        <div className="col-12">
          <label className="form-label small">Full Plot</label>
          <textarea
            className="form-control"
            rows={3}
            value={formData.fullplot}
            onChange={handleChange("fullplot")}
          />
        </div>

        <div className="col-6 col-md-3">
          <label className="form-label small">Rated</label>
          <input
            className="form-control"
            value={formData.rated}
            onChange={handleChange("rated")}
          />
        </div>
        <div className="col-6 col-md-9">
          <label className="form-label small">Genres (comma separated)</label>
          <input
            className="form-control"
            value={formData.genres}
            onChange={handleChange("genres")}
          />
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label small">
            Languages (comma separated)
          </label>
          <input
            className="form-control"
            value={formData.languages}
            onChange={handleChange("languages")}
          />
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label small">
            Countries (comma separated)
          </label>
          <input
            className="form-control"
            value={formData.countries}
            onChange={handleChange("countries")}
          />
        </div>

        <div className="col-12 col-md-4">
          <label className="form-label small">Cast (comma separated)</label>
          <input
            className="form-control"
            value={formData.cast}
            onChange={handleChange("cast")}
          />
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label small">
            Directors (comma separated)
          </label>
          <input
            className="form-control"
            value={formData.directors}
            onChange={handleChange("directors")}
          />
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label small">Writers (comma separated)</label>
          <input
            className="form-control"
            value={formData.writers}
            onChange={handleChange("writers")}
          />
        </div>
      </div>

      <div className="mt-4 d-flex justify-content-end">
        <button type="submit" className="btn btn-dark px-4" disabled={saving}>
          {saving ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default MovieForm;
