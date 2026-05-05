import express from 'express';
import ExploreController from '../controller/explore.controller';
import SearchController from '../controller/search.controller';
import SearchMiddleware from '../middleware/search.middleware';

class SearchRoute {
    public router: express.Router;
    private searchController: SearchController;
    private exploreController: ExploreController;
    constructor() {
        this.router = express.Router();
        this.searchController = new SearchController();
        this.exploreController = new ExploreController();

        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get('/', (req, res) => {
            res.send('Search Route is working');
        });

        this.router.get('/explore', this.exploreController.exploreMovies);
        this.router.get('/explore/:id', this.exploreController.exploreMovieById);

        this.router.use(SearchMiddleware.authenticateToken);
        this.router.get('/movies', this.searchController.searchMovies)
        this.router.get('/movies/:id', this.searchController.searchMovieById);
        this.router.post('/movies', this.searchController.addMovie);
        this.router.put('/movies/:id', this.searchController.updateMovie);
        this.router.delete('/movies/:id', this.searchController.deleteMovie);
        this.router.get('/users/movies', this.searchController.getUserMovies);
        this.router.get('/suggestions', this.searchController.searchSuggestions);
        this.router.get('/comments/:movieId', this.searchController.movieComments);
        this.router.post('/comments/:movieId', this.searchController.addComment);
        this.router.put('/comments/:commentId', this.searchController.updateComment);
        this.router.delete('/comments/:commentId', this.searchController.deleteComment);
    }
}

export default SearchRoute;