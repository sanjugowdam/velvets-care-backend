const { Op } = require('sequelize');
const { Subcategories, Categories } = require('../models');

// Create Subcategory
const CreateSubCategory = async (req, res) => {
  try {
    const session_user = req.headers.user;
    if (!session_user) throw new Error('Session expired');

    const { name, slug, is_active, category_id } = req.payload;

    const existing = await Subcategories.findOne({ where: { name, category_id } });
    if (existing) throw new Error('Subcategory already exists in this category');

    const subcategory = await Subcategories.create({
      name,
      slug,
      category_id,
      is_active: is_active ?? true,
    });

    return res.response({
      success: true,
      message: 'Subcategory created successfully',
      data: subcategory,
    }).code(201);
  } catch (error) {
    console.error('Error creating subcategory:', error);
    return res.response({ success: false, message: error.message });
  }
};

// Update Subcategory
const UpdateSubCategory = async (req, res) => {
  try {
    const session_user = req.headers.user;
    if (!session_user) throw new Error('Session expired');

    const subId = req.params.id;
    const { name, slug, is_active, category_id } = req.payload;

    const subcategory = await Subcategories.findByPk(subId);
    if (!subcategory) throw new Error('Subcategory not found');

    await subcategory.update({ name, slug, is_active, category_id });

    return res.response({
      success: true,
      message: 'Subcategory updated successfully',
      data: subcategory,
    });
  } catch (error) {
    console.error('Error updating subcategory:', error);
    return res.response({ success: false, message: error.message });
  }
};

// Delete Subcategory
const DeleteSubCategory = async (req, res) => {
  try {
    const session_user = req.headers.user;
    if (!session_user) throw new Error('Session expired');

    const subId = req.params.id;
    const subcategory = await Subcategories.findByPk(subId);
    if (!subcategory) throw new Error('Subcategory not found');

    await subcategory.destroy();

    return res.response({
      success: true,
      message: 'Subcategory deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    return res.response({ success: false, message: error.message });
  }
};

// Admin Fetch Subcategories
const AdminSubCategories = async (req, res) => {
  try {
    const session_user = req.headers.user;
    if (!session_user) throw new Error('Session expired');

    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) where.name = { [Op.like]: `%${search}%` };

    const count = await Subcategories.count({ where });

    const subcategories = await Subcategories.findAll({
      where,
      include: [{ model: Categories }],
      limit,
      offset,
    });

    return res.response({
      success: true,
      message: 'Subcategories fetched successfully',
      data: {
        subcategories,
        total: count,
        page,
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return res.response({ success: false, message: error.message });
  }
};

// User Fetch Subcategories
const UserSubCategories = async (req, res) => {
  try {
    const subcategories = await Subcategories.findAll({ where: { is_active: true } });

    return res.response({
      success: true,
      data: subcategories,
    });
  } catch (error) {
    console.error('Error fetching user subcategories:', error);
    return res.response({ success: false, message: error.message });
  }
};

// Get Single Subcategory
const GetSubCategoryById = async (req, res) => {
  try {
    const subId = req.params.id;

    const subcategory = await Subcategories.findByPk(subId, { include: [{ model: Categories }] });
    if (!subcategory) throw new Error('Subcategory not found');

    return res.response({
      success: true,
      data: subcategory,
    });
  } catch (error) {
    console.error('Error fetching subcategory:', error);
    return res.response({ success: false, message: error.message });
  }
};

module.exports = {
  CreateSubCategory,
  UpdateSubCategory,
  DeleteSubCategory,
  AdminSubCategories,
  UserSubCategories,
  GetSubCategoryById,
};
