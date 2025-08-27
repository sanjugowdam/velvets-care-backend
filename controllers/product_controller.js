
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

const uploadProductImage = async (req, res) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) {
            throw new Error('Session expired');
        }
        const {
            product_id, file
        } = req.payload
        const product = await Products.findOne({ where: { id: product_id } });
        if (!product) {
            throw new Error('Product not found');
        }
        const image = await ProductImages.create({
            product_id,
            file_url: file.file_url,
            extension: file.extension,
            original_name: file.original_name,
            size: file.size
        });
        return res.response({
            success: true,
            message: 'Product image uploaded successfully',
            data: image
        }).code(201);
    } catch (error) {
        console.error('Error uploading product image:', error);
        return res.response({
            success: false,
            message: ' something went wrong while uploading product image'
        }).code(200);
    }
};    

const adminProducts = async (req, res) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) {
            throw new Error('Session expired');
        }
        const {
            page = 1,
            limit = 10,
            search = '',
        } = req.query;
        const offset = (page - 1) * limit;
        const where = {
            is_active: true,
        };
        if (search) {
            where.name = {
                [Op.like]: `%${search}%`,
            };
            where.description = {
                [Op.like]: `%${search}%`,
            };
            where.sku = {
                [Op.like]: `%${search}%`,   
            };
        }
        const products = await Products.findAll({
            where,
            limit,
            offset,
        });
        return res.response({
            success: true,
            message: 'Products fetched successfully',
            data: products,
        }).code(200);
    } catch (error) {
            console.error('Error fetching products:', error);
            return res.response({
                success: false,
            });
    }
};
       


module.exports = {
    CreateProduct,
    GetProductById,
    uploadProductImage,
    
}