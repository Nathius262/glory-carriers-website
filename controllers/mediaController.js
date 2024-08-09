import {searchSermon} from './searchController.js'
const renderStream = async (req, res) => {
    try {
        res.render('stream');
    } catch (error) {
        res.status(404).send('page not found');
    }
};


const renderSearch = async (req, res) => {
    try {
      res.render('search', await searchSermon(req));
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  };
  

export {renderStream, renderSearch}