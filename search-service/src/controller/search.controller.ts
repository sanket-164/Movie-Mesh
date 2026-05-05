import { Request, Response } from 'express';
import Movie from '../model/Movie';
import Comment from '../model/Comment';
import mongoose from 'mongoose';
import SearchProducer from '../producer/search.producer';
import { SEARCH_TOPIC, ALLOWED_SEARCH_PATHS, MOVIE_PROJECTED_FIELDS, DEFAULT_MOVIE_LIMIT } from '../util/constant';

type MovieType = typeof Movie;

type SearchMoviesQuery = {
    skip?: string;
    limit?: string;
    path?: string;
    paginationToken?: string;
    q?: string;
};

type MovieCommentsQuery = {
    skip?: string;
    limit?: string;
};

type AddMovieBody = {
    title?: string;
    plot?: string;
    fullplot?: string;
    poster?: string;
    year?: number;
    runtime?: number;
    rated?: string;
    genres?: string[];
    languages?: string[];
    countries?: string[];
    cast?: string[];
    directors?: string[];
    writers?: string[];
};

type UpdateMovieBody = AddMovieBody;

type AddCommentBody = {
    text?: string;
    name?: string;
    email?: string;
};

type UpdateCommentBody = {
    text?: string;
};

class SearchController {
    private searchProducer;

    constructor() {
        this.searchProducer = SearchProducer.getInstance();
    }

    public searchMovieById = async (req: Request<{ id: string }, {}, {}, {}>, res: Response): Promise<void> => {
        const movieId = req.params.id;

        try {
            if (!movieId || !mongoose.Types.ObjectId.isValid(movieId)) {
                res.status(400).json({ message: 'Movie ID is invalid' });
                return;
            }

            const movie: MovieType | null = await Movie.findById(movieId);

            if (!movie) {
                res.status(404).json({ message: 'Movie not found' });
                return;
            }

            res.status(200).json(movie);

            await this.searchProducer.sendMessage(SEARCH_TOPIC, {
                userId: req.user || 0,
                query: req.url
            });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    public addMovie = async (req: Request<{}, {}, AddMovieBody, {}>, res: Response): Promise<void> => {
        const userId = req.user;
        const {
            title,
            plot,
            fullplot,
            poster,
            year,
            runtime,
            rated,
            genres,
            languages,
            countries,
            cast,
            directors,
            writers,
        } = req.body;

        try {
            if (!userId) {
                res.status(401).json({ message: 'You are not authorized' });
                return;
            }

            if (!title || !title.trim()) {
                res.status(400).json({ message: 'Movie title is required' });
                return;
            }

            const createdMoviePayload: Record<string, unknown> = {
                title: title.trim(),
                user_id: userId,
                release: new Date(),
                lastUpdated: new Date().toISOString(),
            };

            if (plot !== undefined) createdMoviePayload.plot = plot;
            if (fullplot !== undefined) createdMoviePayload.fullplot = fullplot;
            if (poster !== undefined) createdMoviePayload.poster = poster;
            if (year !== undefined) createdMoviePayload.year = year;
            if (runtime !== undefined) createdMoviePayload.runtime = runtime;
            if (rated !== undefined) createdMoviePayload.rated = rated;
            if (genres !== undefined) createdMoviePayload.genres = genres;
            if (languages !== undefined) createdMoviePayload.languages = languages;
            if (countries !== undefined) createdMoviePayload.countries = countries;
            if (cast !== undefined) createdMoviePayload.cast = cast;
            if (directors !== undefined) createdMoviePayload.directors = directors;
            if (writers !== undefined) createdMoviePayload.writers = writers;

            const createdMovie = await Movie.create(createdMoviePayload);

            res.status(201).json(createdMovie);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    public updateMovie = async (req: Request<{ id: string }, {}, UpdateMovieBody, {}>, res: Response): Promise<void> => {
        const movieId = req.params.id;
        const userId = req.user;

        try {
            if (!userId) {
                res.status(401).json({ message: 'You are not authorized' });
                return;
            }

            if (!movieId || !mongoose.Types.ObjectId.isValid(movieId)) {
                res.status(400).json({ message: 'Movie ID is invalid' });
                return;
            }

            const payload = { ...req.body };

            if (payload.title !== undefined && !payload.title.trim()) {
                res.status(400).json({ message: 'Movie title cannot be empty' });
                return;
            }

            if (Object.keys(payload).length === 0) {
                res.status(400).json({ message: 'At least one field is required to update' });
                return;
            }

            const updatedMovie = await Movie.findOneAndUpdate(
                { _id: movieId, user_id: userId },
                {
                    ...payload,
                    lastUpdated: new Date().toISOString(),
                },
                { new: true }
            );

            if (!updatedMovie) {
                res.status(404).json({ message: 'Movie not found' });
                return;
            }

            res.status(200).json(updatedMovie);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    public deleteMovie = async (req: Request<{ id: string }, {}, {}, {}>, res: Response): Promise<void> => {
        const movieId = req.params.id;
        const userId = req.user;

        try {
            if (!userId) {
                res.status(401).json({ message: 'You are not authorized' });
                return;
            }

            if (!movieId || !mongoose.Types.ObjectId.isValid(movieId)) {
                res.status(400).json({ message: 'Movie ID is invalid' });
                return;
            }

            const deletedMovie = await Movie.findOneAndDelete({ _id: movieId, user_id: userId });

            if (!deletedMovie) {
                res.status(404).json({ message: 'Movie not found for this user' });
                return;
            }

            await Comment.deleteMany({ movie_id: movieId, user_id: userId });

            res.status(200).json({ message: 'Movie deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    public getUserMovies = async (req: Request<{}, {}, {}, { skip?: string; limit?: string }>, res: Response): Promise<void> => {
        const userId = req.user;
        const { skip, limit } = req.query;

        try {
            if (!userId) {
                res.status(401).json({ message: 'You are not authorized' });
                return;
            }

            const skipNumber = skip ? parseInt(skip) : 0;
            const limitNumber = limit ? parseInt(limit) : DEFAULT_MOVIE_LIMIT;

            const movies = await Movie.find({ user_id: userId })
                .sort({ createdAt: -1 })
                .skip(skipNumber)
                .limit(limitNumber);

            const totalMovies = await Movie.countDocuments({ user_id: userId });

            res.status(200).json({ movies, totalMovies });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    public searchSuggestions = async (req: Request<{}, {}, {}, { q: string, limit?: string }>, res: Response): Promise<void> => {
        const { q, limit } = req.query;

        try {
            if (!q) {
                res.status(400).json({ message: 'Search Query is required' });
                return;
            }

            const suggestions = await Movie.aggregate([
                {
                    $search: {
                        index: "suggestion",
                        autocomplete: {
                            query: q,
                            path: "title"
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        poster: 1,
                        year: 1
                    }
                },
                {
                    $limit: limit ? parseInt(limit) : 5
                }
            ]);


            res.status(200).json(suggestions);

            await this.searchProducer.sendMessage(SEARCH_TOPIC, {
                userId: req.user || 0,
                query: req.url
            });

        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    public searchMovies = async (req: Request<{}, {}, {}, SearchMoviesQuery>, res: Response): Promise<void> => {
        const { q, skip, limit, path, paginationToken } = req.query;
        const limitNumber = limit ? parseInt(limit) : DEFAULT_MOVIE_LIMIT;
        const skipNumber = skip ? parseInt(skip) : 0;

        try {

            if (!q) {
                res.status(400).json({ message: 'Search Query is required' });
                return;
            }

            const pathArray = path ? path.split(',').filter(p => ALLOWED_SEARCH_PATHS.includes(p)) : ALLOWED_SEARCH_PATHS;

            const searchStage: mongoose.PipelineStage = {
                $search: {
                    index: "default",
                    text: {
                        query: q,
                        path: pathArray.length > 0 ? pathArray : { wildcard: "*" }
                    },
                    searchAfter: paginationToken ? paginationToken : undefined,
                },
            };

            const projectStage: mongoose.PipelineStage = { $project: { paginationToken: { $meta: "searchSequenceToken" }, score: { $meta: "searchScore" }, ...MOVIE_PROJECTED_FIELDS } };

            const skipStage: mongoose.PipelineStage = { $skip: skipNumber };

            const limitStage: mongoose.PipelineStage = { $limit: limitNumber };

            const aggregationPipeline: mongoose.PipelineStage[] = [searchStage, projectStage];

            // PaginationToken takes precedence over skip to increase performance
            // Visible increased performance can be seen if the skip parameter is around 1000
            // Check the results by using "skip=1000" and then paginationToken="<pagination_token_from_999th_result>"
            // This is because skip still needs to iterate through the previous documents internally
            aggregationPipeline.push({
                $facet: {
                    data: paginationToken ? [limitStage] : [skipStage, limitStage],
                    totalMovies: [{ $count: 'count' }],
                }
            });

            const movies: MovieType[] = await Movie.aggregate(aggregationPipeline);

            res.status(200).json(movies[0]);

            await this.searchProducer.sendMessage(SEARCH_TOPIC, {
                userId: req.user || 0,
                query: req.url
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    public movieComments = async (req: Request<{ movieId: string }, {}, {}, MovieCommentsQuery>, res: Response): Promise<void> => {
        const { movieId } = req.params;
        const { skip, limit } = req.query;

        try {

            if (!movieId || !mongoose.Types.ObjectId.isValid(movieId)) {
                res.status(400).json({ message: 'Movie ID is invalid' });
                return;
            }

            const skipNumber = skip ? parseInt(skip) : 0;
            const limitNumber = limit ? parseInt(limit) : 5;

            const comments = await Comment.find({ movie_id: movieId })
                .skip(skipNumber)
                .limit(limitNumber);

            res.status(200).json(comments);

            await this.searchProducer.sendMessage(SEARCH_TOPIC, {
                userId: req.user || 0,
                query: req.url
            });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    public addComment = async (req: Request<{ movieId: string }, {}, AddCommentBody, {}>, res: Response): Promise<void> => {
        const { movieId } = req.params;
        const { text, name, email } = req.body;
        const userId = req.user;

        try {
            if (!userId) {
                res.status(401).json({ message: 'You are not authorized' });
                return;
            }

            if (!movieId || !mongoose.Types.ObjectId.isValid(movieId)) {
                res.status(400).json({ message: 'Movie ID is invalid' });
                return;
            }

            if (!text || !text.trim()) {
                res.status(400).json({ message: 'Comment text is required' });
                return;
            }

            const movie = await Movie.findById(movieId);
            if (!movie) {
                res.status(404).json({ message: 'Movie not found' });
                return;
            }

            const commentPayload: Record<string, unknown> = {
                movie_id: movieId,
                text: text.trim(),
                user_id: userId,
                date: new Date(),
            };

            if (name !== undefined) commentPayload.name = name;
            if (email !== undefined) commentPayload.email = email;

            const comment = await Comment.create(commentPayload);

            res.status(201).json(comment);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    public updateComment = async (req: Request<{ commentId: string }, {}, UpdateCommentBody, {}>, res: Response): Promise<void> => {
        const { commentId } = req.params;
        const { text } = req.body;
        const userId = req.user;

        try {
            if (!userId) {
                res.status(401).json({ message: 'You are not authorized' });
                return;
            }

            if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
                res.status(400).json({ message: 'Comment ID is invalid' });
                return;
            }

            if (!text || !text.trim()) {
                res.status(400).json({ message: 'Comment text is required' });
                return;
            }

            const updatedComment = await Comment.findOneAndUpdate(
                { _id: commentId, user_id: userId },
                {
                    text: text.trim(),
                    date: new Date(),
                },
                { new: true }
            );

            if (!updatedComment) {
                res.status(404).json({ message: 'Comment not found for this user' });
                return;
            }

            res.status(200).json(updatedComment);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    public deleteComment = async (req: Request<{ commentId: string }, {}, {}, {}>, res: Response): Promise<void> => {
        const { commentId } = req.params;
        const userId = req.user;

        try {
            if (!userId) {
                res.status(401).json({ message: 'You are not authorized' });
                return;
            }

            if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
                res.status(400).json({ message: 'Comment ID is invalid' });
                return;
            }

            const deletedComment = await Comment.findOneAndDelete({ _id: commentId, user_id: userId });

            if (!deletedComment) {
                res.status(404).json({ message: 'Comment not found for this user' });
                return;
            }

            res.status(200).json({ message: 'Comment deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default SearchController;