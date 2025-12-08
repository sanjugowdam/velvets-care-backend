'use strict';

const { Op } = require('sequelize');
const {
    Products,
    ProductImages,
    Categories,
    Subcategories,
    Brands,
} = require('../models');
const {
    FileFunctions, JWTFunctions, RazorpayFunctions, AgoraFunctions
} = require('../helpers');


// Create Product
const CreateProduct = async (req, res) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) throw new Error('Session expired');

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
            description,
        } = req.payload;

        const existing = await Products.findOne({ where: { sku } });
        if (existing) throw new Error('Product with this SKU already exists');

        const product = await Products.create({
            name,
            mrp_price,
            selling_price,
            sku,
            category_id,
            sub_category_id: sub_category_id || null,
            brand_id,
            tags: tags || null,
            is_active: is_active ?? true,
            is_featured: is_featured ?? false,
            is_new: is_new ?? false,
            stock,
            description: description || null,
        });

        return res.response({
            success: true,
            message: 'Product created successfully',
            data: product,
        }).code(201);
    } catch (error) {
        console.error('Error creating product:', error);
        return res.response({ success: false, message: error.message });
    }
};

// Update Product
const UpdateProduct = async (req, res) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) throw new Error('Session expired');

        const { id } = req.params;
        const updates = req.payload;

        const product = await Products.findOne({ where: { id } });
        if (!product) throw new Error('Product not found');

        await product.update(updates);

        return res.response({
            success: true,
            message: 'Product updated successfully',
            data: product,
        });
    } catch (error) {
        console.error('Error updating product:', error);
        return res.response({ success: false, message: error.message });
    }
};

// Delete Product
const DeleteProduct = async (req, res) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) throw new Error('Session expired');

        const { id } = req.params;

        const product = await Products.findOne({ where: { id } });
        if (!product) throw new Error('Product not found');

        await product.destroy();

        return res.response({
            success: true,
            message: 'Product deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        return res.response({ success: false, message: error.message });
    }
};

// Get Product By ID (Admin + User)
const GetProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Products.findOne({
      where: { id },
      include: [
        { model: ProductImages },
        { model: Brands },
        { model: Categories },
        { model: Subcategories },
      ],
    });

    if (!product) throw new Error('Product not found');

    const productJSON = product.toJSON();

    // Map S3 URLs for images
    productJSON.ProductImages = await Promise.all(
      productJSON.ProductImages.map(async (img) => ({
        ...img,
        file_url: img.file_url ? await FileFunctions.getFromS3(img.file_url) : null,
      }))
    );

    return res.response({ success: true, data: productJSON });
  } catch (error) {
    console.error('Error fetching product by id:', error);
    return res.response({ success: false, message: error.message });
  }
};


// Admin Fetch Products (with page, limit, search)
const AdminProducts = async (req, res) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) throw new Error('Session expired');

        const { page = 1, limit = 10, search = '' } = req.query;
        const offset = (page - 1) * limit;

        const where = {};
        if (search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } },
                { sku: { [Op.like]: `%${search}%` } },
            ];
        }

        const { rows, count } = await Products.findAndCountAll({
            where,
            limit,
            offset,
            include: [Brands, Categories, Subcategories],
        });

        return res.response({
            success: true,
            message: 'Products fetched successfully',
            total: count,
            page,
            limit,
            data: rows,
        });
    } catch (error) {
        console.error('Error fetching admin products:', error);
        return res.response({ success: false, message: error.message });
    }
};

// User Fetch Products (with page, limit, search)
const UserProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const offset = (page - 1) * limit;

        const where = { is_active: true };
        if (search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } },
            ];
        }

        const { rows, count } = await Products.findAndCountAll({
            where,
            limit,
            offset,
            include: [Brands, Categories, Subcategories],
        });

        return res.response({
            success: true,
            message: 'Products fetched successfully',
            total: count,
            page,
            limit,
            data: rows,
        });
    } catch (error) {
        console.error('Error fetching user products:', error);
        return res.response({ success: false, message: error.message });
    }
};

// Upload Product Image
const UploadProductImage = async (req, res) => {
  try {
    const session_user = req.headers.user;
    if (!session_user) throw new Error('Session expired');

    const { product_id, files } = req.payload; // `files` is an array

    const uploadedFiles = await Promise.all(files.map(async (file) => {
      const uploaded = await FileFunctions.uploadToS3(file.filename, 'uploads/products', fs.readFileSync(file.path));
      return ProductImages.create({
        product_id,
        file_url: uploaded.key,
        extension: uploaded.key.split('.').pop(),
        original_name: uploaded.key,
        size: fs.statSync(file.path).size,
      });
    }));

    return res.response({
      success: true,
      message: 'Product images uploaded successfully',
      data: uploadedFiles,
    }).code(201);
  } catch (error) {
    console.error('Error uploading product images:', error);
    return res.response({ success: false, message: error.message });
  }
};


// Delete Product Image
const DeleteProductImage = async (req, res) => {
  try {
    const session_user = req.headers.user;
    if (!session_user) throw new Error('Session expired');

    const imageId = req.params.id;
    const image = await ProductImages.findByPk(imageId);
    if (!image) throw new Error('Image not found');

    await image.destroy();

    return res.response({
      success: true,
      message: 'Product image deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product image:', error);
    return res.response({ success: false, message: error.message });
  }
};

// Get Product Images by Product
const GetImagesByProduct = async (req, res) => {
  try {
    const productId = req.params.productId;

    const images = await ProductImages.findAll({ where: { product_id: productId }, raw: true });

    const imagesWithUrl = await Promise.all(
      images.map(async (img) => ({
        ...img,
        file_url: img.file_url ? await FileFunctions.getFromS3(img.file_url) : null
      }))
    );

    return res.response({
      success: true,
      data: imagesWithUrl,
    });
  } catch (error) {
    console.error('Error fetching product images:', error);
    return res.response({ success: false, message: error.message });
  }
};

module.exports = {
    CreateProduct,
    UpdateProduct,
    DeleteProduct,
    DeleteProductImage,
    GetImagesByProduct,
    GetProductById,
    AdminProducts,
    UserProducts,
    UploadProductImage,
};
