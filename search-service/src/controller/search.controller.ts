import { Request, Response} from 'express';
import Movie from '../model/Movie';
import mongoose from 'mongoose';

type MovieType = typeof Movie;

type FindMovieByIdParams = {
    id: string;
};

class SearchController {
    public findMovieById = async (req: Request<FindMovieByIdParams, {}, {}, {}>, res: Response): Promise<void> => {
        const movieId = req.params.id;

        try {
            if(!movieId || !mongoose.Types.ObjectId.isValid(movieId)) {
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
}

export default SearchController;