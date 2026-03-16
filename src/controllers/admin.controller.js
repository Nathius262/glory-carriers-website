

export const dashboard_view = async (req, res) => {
    try {
        return res.render('./admins/dashboard', {
            pageTitle: 'Dashboard',
            layout: 'admin'
        })
    } catch (error) {
        console.log(error)
        return render('error/500', {'error': error.message})
    }
}