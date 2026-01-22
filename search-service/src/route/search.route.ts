import express from 'express';
import SearchController from '../controller/search.controller';

class SearchRoute {
    public router: express.Router;
    private searchController: SearchController;

    constructor() {
        this.router = express.Router();
        this.searchController = new SearchController();

        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get('/find-movie/:id', this.searchController.findMovieById);
    }
}

export default SearchRoute;