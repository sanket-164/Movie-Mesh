import { Request, Response } from 'express';
import Movie from '../model/Movie';
import mongoose from 'mongoose';

type MovieType = typeof Movie;

type FindMovieByIdParams = {
    id: string;
};

type SearchMoviesQuery = {
    skip?: string;
    limit?: string;
    path?: string;
    paginationToken?: string;
    q: string;
};

class SearchController {
    public findMovieById = async (req: Request<FindMovieByIdParams, {}, {}, {}>, res: Response): Promise<void> => {
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
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    public searchMovies = async (req: Request<{}, {}, {}, SearchMoviesQuery>, res: Response): Promise<void> => {
        const { q, skip, limit, path, paginationToken } = req.query;

        try {

            if (!q) {
                res.status(400).json({ message: 'Search Query is required' });
                return;
            }

            const skipNumber = skip ? parseInt(skip) : 0;
            const limitNumber = limit ? parseInt(limit) : 10;
            const pathArray = path ? path.split(',') : [];

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

            const projectStage: mongoose.PipelineStage = { $project: { paginationToken: { $meta: "searchSequenceToken" }, score: { $meta: "searchScore" }, title: 1, plot: 1, poster: 1, genres: 1, year: 1, imdb: 1 } };

            const skipStage: mongoose.PipelineStage = { $skip: skipNumber };

            const limitStage: mongoose.PipelineStage = { $limit: limitNumber };

            const aggregationPipeline: mongoose.PipelineStage[] = [searchStage, projectStage];

            // PaginationToken takes precedence over skip to increase performance
            // Visible increased performance can be seen if the skip parameter is around 1000
            // Check the results by using "skip=1000" and then paginationToken="<pagination_token_from_999th_result>"
            // This is because skip still needs to iterate through the previous documents internally
            if (paginationToken) {
                aggregationPipeline.push(limitStage);
            } else {
                aggregationPipeline.push(skipStage, limitStage);
            }

            const movies: MovieType[] = await Movie.aggregate(aggregationPipeline);

            res.status(200).json(movies)
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default SearchController;