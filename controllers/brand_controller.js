const { Op } = require('sequelize');
const { Brands } = require('../models');

// Create Brand
const CreateBrand = async (req, res) => {
  try {
    const session_user = req.headers.user;
    if (!session_user) throw new Error('Session expired');

    const { name, slug, is_active } = req.payload;

    const existing = await Brands.findOne({ where: { name } });
    if (existing) throw new Error('Brand already exists');

    const brand = await Brands.create({
      name,
      slug,
      is_active: is_active ?? true,
    });

    return res.response({
      success: true,
      message: 'Brand created successfully',
      data: brand,
    }).code(201);
  } catch (error) {
    console.error('Error creating brand:', error);
    return res.response({ success: false, message: error.message });
  }
};

// Update Brand
const UpdateBrand = async (req, res) => {
  try {
    const session_user = req.headers.user;
    if (!session_user) throw new Error('Session expired');

    const brandId = req.params.id;
    const { name, slug, is_active } = req.payload;

    const brand = await Brands.findByPk(brandId);
    if (!brand) throw new Error('Brand not found');

    await brand.update({ name, slug, is_active });

    return res.response({
      success: true,
      message: 'Brand updated successfully',
      data: brand,
    });
  } catch (error) {
    console.error('Error updating brand:', error);
    return res.response({ success: false, message: error.message });
  }
};

// Delete Brand
const DeleteBrand = async (req, res) => {
  try {
    const session_user = req.headers.user;
    if (!session_user) throw new Error('Session expired');

    const brandId = req.params.id;
    const brand = await Brands.findByPk(brandId);
    if (!brand) throw new Error('Brand not found');

    await brand.destroy();

    return res.response({
      success: true,
      message: 'Brand deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting brand:', error);
    return res.response({ success: false, message: error.message });
  }
};

// Admin Fetch Brands
const AdminBrands = async (req, res) => {
  try {
    const session_user = req.headers.user;
    if (!session_user) throw new Error('Session expired');

    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) where.name = { [Op.like]: `%${search}%` };

    const brands = await Brands.findAll({ where, limit, offset });

    return res.response({
      success: true,
      message: 'Brands fetched successfully',
      data: brands,
    });
  } catch (error) {
    console.error('Error fetching brands:', error);
    return res.response({ success: false, message: error.message });
  }
};

// User Fetch Brands
const UserBrands = async (req, res) => {
  try {
    const brands = await Brands.findAll({ where: { is_active: true } });

    return res.response({
      success: true,
      data: brands,
    });
  } catch (error) {
    console.error('Error fetching user brands:', error);
    return res.response({ success: false, message: error.message });
  }
};

// Get Single Brand
const GetBrandById = async (req, res) => {
  try {
    const brandId = req.params.id;

    const brand = await Brands.findByPk(brandId);
    if (!brand) throw new Error('Brand not found');

    return res.response({
      success: true,
      data: brand,
    });
  } catch (error) {
    console.error('Error fetching brand:', error);
    return res.response({ success: false, message: error.message });
  }
};

module.exports = {
  CreateBrand,
  UpdateBrand,
  DeleteBrand,
  AdminBrands,
  UserBrands,
  GetBrandById,
};
