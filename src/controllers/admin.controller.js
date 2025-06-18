

export const dashboard_view = async (req, res) => {
    try {
        return res.render('dashboard', {
            pageTitle: 'Dashboard',
        })
    } catch (error) {
        console.log(error)
        return render('error/500', {'error': error.message})
    }
}