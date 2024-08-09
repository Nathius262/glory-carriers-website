import {searchSermon, searchZoeRecord, searchNowword} from './searchController.js'
const renderStream = async (req, res) => {
    try {
        res.render('stream');
    } catch (error) {
        res.status(404).send('page not found');
    }
};


const renderSearch = async (req, res) => {
    try {
      const [sermonData, zoeRecordData, nowwordData] = await Promise.all([
        searchSermon(req),
        searchZoeRecord(req),
        searchNowword(req),
      ]);
  
      // Combine data and render template
      res.render('search', {
        sermonData,
        zoeRecordData,
        nowwordData
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  };
  

export {renderStream, renderSearch}