
const renderStream = async (req, res) => {
    try {
        res.render('stream');
    } catch (error) {
        res.status(404).send('page not found');
    }
};

export {renderStream}