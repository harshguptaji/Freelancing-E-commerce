import Product from "../models/productModel.js";
import Cart from "../models/cartModel.js";
import User from "../models/userModel.js";


// Add to cart or update quantity if product already in cart
export const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.id;
        const { quantity } = req.body;

        if (quantity <= 0) {
            return res.status(400).json({ message: "Quantity must be greater than zero" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({
                userId,
                items: [],
            });
        }

        const existingItemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId
        );

        if (existingItemIndex >= 0) {
            // ✅ increase quantity instead of replacing
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            cart.items.push({
                productId,
                quantity
            });
        }

        await cart.save();

        // optional: populate for response
        const updatedCart = await Cart.findById(cart._id)
            .populate("items.productId");

        res.status(200).json({
            message: "Product added to cart",
            cart: updatedCart
        });

    } catch (error) {
        console.log(`Error adding to cart: ${error.message}`);
        res.status(500).json({ message: "Failed to add to cart" });
    }
};

// Get Cart login User
export const getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ userId })
            .populate("items.productId");

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        res.status(200).json({
            message: "Cart fetched successfully",
            success: true,
            cart
        });
    } catch (error) {
        console.log(`Error fetching cart: ${error.message}`);
        res.status(500).json({ message: "Failed to fetch cart" });
    }
};

// get all carts (admin)
export const getAllCarts = async (req, res) => {
    try {
        const carts = await Cart.find()
            .populate("userId", "name email")
            .populate("items.productId", "name price");

        res.status(200).json({
            message: "All carts fetched successfully",
            success: true,
            carts
        });
    } catch (error) {
        console.log(`Error fetching all carts: ${error.message}`);
        res.status(500).json({ message: "Failed to fetch all carts" });
    }
};

// Updating cart item quantity
export const updateCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.id;
        const { quantity } = req.body;

        if (quantity < 0) {
            return res.status(400).json({ message: "Quantity cannot be negative" });
        }

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const itemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: "Product not in cart" });
        }

        if (quantity === 0) {
            // Remove item from cart
            cart.items.splice(itemIndex, 1);
            
             // ✅ If cart becomes empty → delete entire cart
            if (cart.items.length === 0) {
                await Cart.findByIdAndDelete(cart._id);

                return res.status(200).json({
                    message: "Cart is now empty and deleted",
                    cart: null
                });
            }
        } else {
            // Update quantity
            cart.items[itemIndex].quantity = quantity;
        }

        await cart.save();

        const updatedCart = await Cart.findById(cart._id)
            .populate("items.productId");

        res.status(200).json({
            message: "Cart item updated successfully",
            cart: updatedCart
        });
    } catch (error) {
        console.log(`Error updating cart item: ${error.message}`);
        res.status(500).json({ message: "Failed to update cart item" });
    }
};

// Remove item from cart
export const removeCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.id;

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const itemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: "Product not in cart" });
        }

        cart.items.splice(itemIndex, 1);

          // ✅ If cart becomes empty → delete entire cart
        if (cart.items.length === 0) {
            await Cart.findByIdAndDelete(cart._id);

            return res.status(200).json({
                message: "Cart is now empty and deleted",
                cart: null
            });
        }

        // remove cart item and save
        await cart.save();

        const updatedCart = await Cart.findById(cart._id)
            .populate("items.productId");

        res.status(200).json({
            message: "Cart item removed successfully",
            cart: updatedCart
        });
    } catch (error) {
        console.log(`Error removing cart item: ${error.message}`);
        res.status(500).json({ message: "Failed to remove cart item" });
    }
};