import express from 'express';
import SearchController from '../controller/search.controller';
import SearchMiddleware from '../middleware/search.middleware';

class SearchRoute {
    public router: express.Router;
    private searchController: SearchController;

    constructor() {
        this.router = express.Router();
        this.searchController = new SearchController();

        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get('/', (req, res) => {
            res.send('Search Route is working');
        });

        this.router.use(SearchMiddleware.authenticateToken);

        this.router.get('/movies', this.searchController.searchMovies)
        this.router.get('/movies/:id', this.searchController.findMovieById);
    }
}

export default SearchRoute;