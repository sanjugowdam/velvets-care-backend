'use strict';
const { Wishlists, Users } = require('../models');
const { sequelize } = require('../config');
const { Op } = require('sequelize');

// Add product to wishlist
const AddToWishlist = async (req, res) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) throw new Error('Session expired');

        const { product_id } = req.payload;

        const existing = await Wishlists.findOne({
            where: { user_id: session_user.user_id, product_id }
        });

        if (existing) {
            return res.response({
                success: true,
                message: 'Product already in wishlist',
                data: existing
            });
        }

        const wishlistItem = await Wishlists.create({
            user_id: session_user.user_id,
            product_id
        });

        return res.response({
            success: true,
            message: 'Product added to wishlist',
            data: wishlistItem
        }).code(201);
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        return res.response({ success: false, message: error.message });
    }
};

// Remove product from wishlist
const RemoveFromWishlist = async (req, res) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) throw new Error('Session expired');

        const { id } = req.params;
        const wishlistItem = await Wishlists.findOne({ where: { id, user_id: session_user.user_id } });
        if (!wishlistItem) throw new Error('Wishlist item not found');

        await wishlistItem.destroy();

        return res.response({
            success: true,
            message: 'Product removed from wishlist'
        });
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        return res.response({ success: false, message: error.message });
    }
};

// Get user's wishlist
const GetWishlist = async (req, res) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) throw new Error('Session expired');

        const wishlistItems = await Wishlists.findAll({
            where: { user_id: session_user.user_id }
        });

        return res.response({
            success: true,
            data: wishlistItems,
            message: 'Wishlist fetched successfully'
        });
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        return res.response({ success: false, message: error.message });
    }
};

// Admin: Get wishlist count per user
const AdminWishlistStats = async (req, res) => {
    try {
        const session_user = req.headers.user;
        if (!session_user || !session_user.is_admin) throw new Error('Unauthorized');
        const wishlistStats = await Wishlists.findAll({
            attributes: [
                'user_id',
                [sequelize.fn('COUNT', sequelize.col('product_id')), 'wishlist_count']
            ],
            group: ['user_id'],
            raw: true
        });

        return res.response({
            success: true,
            message: 'Wishlist stats fetched successfully',
            data: wishlistStats
        });
    } catch (error) {
        console.error('Error fetching wishlist stats:', error);
        return res.response({ success: false, message: error.message });
    }
};

module.exports = {
    AddToWishlist,
    RemoveFromWishlist,
    GetWishlist,
    AdminWishlistStats
};
