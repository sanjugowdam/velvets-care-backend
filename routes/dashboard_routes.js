
const {
    SessionValidator,

} = require('../middlewares')
const Boom = require('@hapi/boom');
// src/routes/authRoutes.js
const {
    DashboardController: {
        getDashboardStats,
        getYearlyDashboardStats
    }
} = require('../controllers');
const {
    DashboardValidator: {
        dashboard_date_range,
        dashboard_yearly
    }
} = require('../validators');
const {
    HeaderValidator,
} = require('../validators');
const tags = ["api", "Dashboard"];
module.exports = [
    {
        method: 'GET',
        path: '/dashboard',
        options: {
            description: 'get dashboard stats',
            tags,
            pre: [
                SessionValidator
            ],
            validate: {
                query: dashboard_date_range,
                headers: HeaderValidator,
            },
        },
        handler: getDashboardStats
    },
    {
        method: 'GET',
        path: '/dashboard/yearly',
        options: {
            description: 'get yearly dashboard stats',
            tags,
            pre: [
                SessionValidator
            ],
            validate: {
                query: dashboard_yearly,
                headers: HeaderValidator,
            },
        },
        handler: getYearlyDashboardStats
    }
];