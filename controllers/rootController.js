const renderIndex= async (req, res) => {
    try {
        res.render('index');
    } catch (error) {
        res.status(404).send('page not found');
    }
};

const renderAbout = async (req, res) => {
    try {
        res.render('about');
    } catch (error) {
        res.status(404).send('page not found');
    }
};

const renderContact = async (req, res) => {
    try {
        res.render('contact');
    } catch (error) {
        res.status(404).send('page not found');
    }
};

const renderEvent= async (req, res) => {
    try {
        res.render('event');
    } catch (error) {
        res.status(404).send('page not found');
    }
};

const renderDepartment = async (req, res) => {
    try {
        res.render('department');
    } catch (error) {
        res.status(404).send('page not found');
    }
};

const renderGiving = async (req, res) => {
    try {
        res.render('giving');
    } catch (error) {
        res.status(404).send('page not found');
    }
};