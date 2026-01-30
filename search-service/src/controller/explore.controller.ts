import { NextFunction, Request, Response } from 'express';
import Movie from '../model/Movie';
import mongoose from 'mongoose';
import { DEFAULT_MOVIE_LIMIT, MOVIE_PROJECTED_FIELDS } from '../util/constant';

type MovieType = typeof Movie;

class ExploreController {

    public exploreMovieById = async (req: Request<{ id: string }, {}, {}, {}>, res: Response, next: NextFunction): Promise<void> => {
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

    public exploreMovies = async (req: Request<{}, {}, {}, {}>, res: Response): Promise<void> => {
        try {

            const movies: MovieType[] = await Movie.aggregate([
                {
                    $facet: {
                        movies: [
                            { $sample: { size: DEFAULT_MOVIE_LIMIT } },
                            { $project: MOVIE_PROJECTED_FIELDS }
                        ],
                        totalMovies: [
                            { $count: "count" }
                        ]
                    }
                }
            ]);

            res.status(200).json(movies[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default ExploreController;