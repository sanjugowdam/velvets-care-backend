const {
    SessionValidator
} = require('../middlewares')
const Boom = require('@hapi/boom');
// src/routes/authRoutes.js
const {
    SpecializationController: {
      createSpecialization,
    getAllSpecializationsAdmin,
    getdoctorsbasedonspecialization,
    getspecilaizationsUsers,
    updateSpecialization,
    deleteSpecialization
        
    }
} = require('../controllers');
const {
    SpecializationValidator: {
       CreateSpecializationValidator,
    UpdateSpecializationValidator,
    DeleteSpecializationValidator,
    getadminspecialization
    },
    HeaderValidator,
} = require('../validators');


const tags = ["api", "Specialization"];

module.exports = [
    {
        method: 'POST',
        path: '/specialization',
        options: {
            description: 'Create a specialization',
            tags,
            pre: [
                SessionValidator
            ],
            validate: {
                payload: CreateSpecializationValidator,
                headers: HeaderValidator,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            }
        },
        handler: createSpecialization
    },
    {
        method: 'GET',
        path: '/specialization',
        options: {
            description: 'Get all specializations admin',
            tags,
            pre: [
                SessionValidator
            ],
            validate: {
                headers: HeaderValidator,
                query: getadminspecialization
            }
        },
        handler: getAllSpecializationsAdmin
    },
    {
        method: 'GET',
        path: '/user/specialization',
        options: {
            description: 'Get all specializations user',
            tags,
            pre: [
                SessionValidator
            ],
            validate: {
                headers: HeaderValidator,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            }
        },
        handler: getspecilaizationsUsers    
    },
    {
        method: 'GET',
        path: '/doctor/specialization/{id}',
        options: {
            description: 'Get all doctors based on specialization',
            tags,
            pre: [
                SessionValidator
            ],
            validate: {
                headers: HeaderValidator,
                query: DeleteSpecializationValidator,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            }
        },
        handler: getdoctorsbasedonspecialization
    },
    {
        method: 'PUT',
        path: '/specialization',
        options: {
            description: 'Update a specialization',
            tags,
            pre: [
                SessionValidator
            ],
            validate: {
                headers: HeaderValidator,
                payload: UpdateSpecializationValidator,
            failAction: (request, h, err) => {
                const errors = err.details.map(e => e.message);
                throw Boom.badRequest(errors.join(', '));
            }
        }
        },
        handler: updateSpecialization
    },
    {
        method: 'DELETE',
        path: '/specialization/{id}',
        options: {
            description: 'Delete a specialization',
            tags,
            pre: [
                SessionValidator
            ],
            validate: {
                headers: HeaderValidator,
                payload: DeleteSpecializationValidator,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            }
        },
        handler: deleteSpecialization   
    }
];