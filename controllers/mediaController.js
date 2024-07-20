
const renderMedia = async (req, res) => {
    try {
        res.render('media');
    } catch (error) {
        res.status(404).send('page not found');
    }
};

const renderZoeRecord = async (req, res) => {
    try {
        res.render('zoe_record');
    } catch (error) {
        res.status(404).send('page not found');
    }
};

const renderStream = async (req, res) => {
    try {
        res.render('stream');
    } catch (error) {
        res.status(404).send('page not found');
    }
};

const renderNowWord = async (req, res) => {
    try {
        res.render('now_word');
    } catch (error) {
        res.status(404).send('page not found');
    }
};

export {renderMedia, renderNowWord, renderStream, renderZoeRecord}