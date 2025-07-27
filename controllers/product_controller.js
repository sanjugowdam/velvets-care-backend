
const {
    Op
} = require('sequelize')
const {
    FileFunctions, JWTFunctions
} = require('../helpers')

const {
    Categories,
    Subcategories,
    ProductImages,
    Products,
    Brands
} = require('../models');
const Brand = require('../models/brand');

const CreateProduct = async (req, res) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) {
            throw new Error('Session expired');
        }
        const {
            name,
            mrp_price,
            selling_price,
            sku,
            category_id,
            sub_category_id,
            brand_id,
            tags,
            is_active,
            is_featured,
            is_new,
            stock,
            description
        } = req.payload

        const product = await Products.create({
            name,
            mrp_price,
            selling_price,
            sku,
            category_id,
            sub_category_id: sub_category_id || null,
            brand_id,
            tags: tags || null,
            is_active: is_active || true,
            is_featured: is_featured || false,
            is_new: is_new || false,
            stock,
            description: description || null
        })

        return res.response({
            success: true,
            message: 'Product created successfully',
            data: product
        }).code(201)
    } catch (error) {
        console.error('Error creating product:', error)
        return res.response({
            success: false,
            message: 'Internal server error'
        }).code(200)
    }
}
const GetProductById = async (req, res) => {
    try {
        const productId = req.params.id

        const product = await Products.findOne({
            where: { id: productId },
            include: [{
                model: ProductImages,
            },
            {
                model:Brands,
            },
            {
                model: Categories,
            },
            {
                model: Subcategories,
            }
        ]
        })

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            })
        }

        return res.status(200).json({
            success: true,
            data: product
        })
    } catch (error) {
        console.error('Error fetching product:', error)
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}    

module.exports = {
    CreateProduct,
    GetProductById
}