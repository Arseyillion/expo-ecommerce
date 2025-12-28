import { User } from "../models/user.model.js";

// the former code we had that got replaced by the AI code
// export async function addAddress(req, res) {
//   try {
//     const { label, fullName, streetAddress, city, state, zipCode, phoneNumber, isDefault } =
//       req.body;

//     const user = req.user;

//     if (!fullName || !streetAddress || !city || !state || !zipCode) {
//       return res.status(400).json({ error: "Missing required address fields" });
//     }

//     // if this is set as default, unset all other defaults
//     if (isDefault) {
//       user.addresses.forEach((addr) => {
//         addr.isDefault = false;
//       });
//     }

//     user.addresses.push({
//       label,
//       fullName,
//       streetAddress,
//       city,
//       state,
//       zipCode,
//       phoneNumber,
//       isDefault: isDefault || false,
//     });

//     await user.save();

//     res.status(201).json({ message: "Address added successfully", addresses: user.addresses });
//   } catch (error) {
//     console.error("Error in addAddress controller:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// }

export async function addAddress(req, res) {
  try {
    /**
     * 1️⃣ Extract address fields from the request body
     * These values are sent from the client (frontend or mobile app)
     */
    const {
      label,
      fullName,
      streetAddress,
      city,
      state,
      zipCode,
      phoneNumber,
      isDefault,
    } = req.body;

    /**
     * 2️⃣ Basic validation
     * If any required field is missing, stop early and return an error.
     * This prevents bad or incomplete data from entering the database.
     */
    if (!fullName || !streetAddress || !city || !state || !zipCode) {
      return res.status(400).json({
        error: "Missing required address fields",
      });
    }

    /**
     * 3️⃣ Build a MongoDB update object
     * We are NOT modifying the user document in memory.
     * Instead, we prepare instructions for MongoDB to execute atomically.
     */
    const update = {
      /**
       * $push adds a new address object to the addresses array
       */
      $push: {
        addresses: {
          label,
          fullName,
          streetAddress,
          city,
          state,
          zipCode,
          phoneNumber,

          /**
           * Convert isDefault to a true/false value
           * This avoids undefined or null values
           */
          isDefault: !!isDefault,
        },
      },
    };

    /**
     * 4️⃣ Handle "default address" logic safely
     *
     * If the new address is marked as default:
     * - We must unset isDefault on ALL existing addresses
     * - This is done directly in the database (atomic operation)
     *
     * "addresses.$[].isDefault":
     * - $[] means "every element in the addresses array"
     */
    if (isDefault) {
      update.$set = {
        "addresses.$[].isDefault": false,
      };
    }

    /**
     * 5️⃣ Execute the database update
     *
     * findByIdAndUpdate:
     * - Finds the user by ID
     * - Applies the update instructions
     * - Runs everything as a single database operation
     *
     * { new: true } ensures we get the UPDATED document back
     */
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      update,
      { new: true }
    );

    /**
     * 6️⃣ Send a success response back to the client
     * We return the updated list of addresses
     */
    res.status(201).json({
      message: "Address added successfully",
      addresses: updatedUser.addresses,
    });
  } catch (error) {
    /**
     * 7️⃣ Catch any unexpected errors
     * This prevents the server from crashing
     */
    console.error("Error in addAddress controller:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
}


export async function getAddresses(req, res) {
  try {
    const user = req.user;

    res.status(200).json({ addresses: user.addresses });
  } catch (error) {
    console.error("Error in getAddresses controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}


// FORMER SOLUTION REPLACED BY THE AI CODE BECAUSE OF RACE CONDITONS BUG DETECTED BY CODE RABBIT
// export async function updateAddress(req, res) {
//   try {
//     const { label, fullName, streetAddress, city, state, zipCode, phoneNumber, isDefault } =
//       req.body;

//     const { addressId } = req.params;

//     const user = req.user;
//     const address = user.addresses.id(addressId);
//     const userId = req.user._id;

//     if (!address) {
//       return res.status(404).json({ error: "Address not found" });
//     }

//     // if this is set as default, unset all other defaults
//     // if (isDefault) {
//     //   user.addresses.forEach((addr) => {
//     //     addr.isDefault = false;
//     //   });
//     // }
//     if (isDefault) {
//       await User.findByIdAndUpdate(userId, {
//         $set: { "addresses.$[].isDefault": false },
//       });
//     }

//     address.label = label || address.label;
//     address.fullName = fullName || address.fullName;
//     address.streetAddress = streetAddress || address.streetAddress;
//     address.city = city || address.city;
//     address.state = state || address.state;
//     address.zipCode = zipCode || address.zipCode;
//     address.phoneNumber = phoneNumber || address.phoneNumber;
//     address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

//     await user.save();

//     res.status(200).json({ message: "Address updated successfully", addresses: user.addresses });
//   } catch (error) {
//     console.error("Error in updateAddress controller:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// }

export async function updateAddress(req, res) {
  try {
    const {
      label,
      fullName,
      streetAddress,
      city,
      state,
      zipCode,
      phoneNumber,
      isDefault,
    } = req.body;

    const { addressId } = req.params;
    const userId = req.user._id;

    /**
     * Step 1: Build the fields we want to update.
     * We only include fields that were actually sent.
     */
    const addressUpdates = {};

    if (label !== undefined) addressUpdates["addresses.$.label"] = label;
    if (fullName !== undefined) addressUpdates["addresses.$.fullName"] = fullName;
    if (streetAddress !== undefined)
      addressUpdates["addresses.$.streetAddress"] = streetAddress;
    if (city !== undefined) addressUpdates["addresses.$.city"] = city;
    if (state !== undefined) addressUpdates["addresses.$.state"] = state;
    if (zipCode !== undefined) addressUpdates["addresses.$.zipCode"] = zipCode;
    if (phoneNumber !== undefined)
      addressUpdates["addresses.$.phoneNumber"] = phoneNumber;
    if (isDefault !== undefined)
      addressUpdates["addresses.$.isDefault"] = !!isDefault;

    /**
     * Step 2: If this address should become the default,
     * unset all existing defaults atomically
     */
    if (isDefault) {
      await User.findByIdAndUpdate(userId, {
        $set: { "addresses.$[].isDefault": false },
      });
    }

    /**
     * Step 3: Update the specific address using positional `$`
     */
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, "addresses._id": addressId },
      { $set: addressUpdates },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "Address not found" });
    }

    res.status(200).json({
      message: "Address updated successfully",
      addresses: updatedUser.addresses,
    });
  } catch (error) {
    console.error("Error in updateAddress controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}


export async function deleteAddress(req, res) {
  try {
    const { addressId } = req.params;
    const user = req.user;

    user.addresses.pull(addressId);
    await user.save();

    res.status(200).json({ message: "Address deleted successfully", addresses: user.addresses });
  } catch (error) {
    console.error("Error in deleteAddress controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function addToWishlist(req, res) {
  try {
    const { productId } = req.body;
    const user = req.user;

    // check if product is already in the wishlist
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ error: "Product already in wishlist" });
    }

    user.wishlist.push(productId);
    await user.save();

    res.status(200).json({ message: "Product added to wishlist", wishlist: user.wishlist });
  } catch (error) {
    console.error("Error in addToWishlist controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function removeFromWishlist(req, res) {
  try {
    const { productId } = req.params;
    const user = req.user;

    // check if product is already in the wishlist
    if (!user.wishlist.includes(productId)) {
      return res.status(400).json({ error: "Product not found in wishlist" });
    }

    user.wishlist.pull(productId);
    await user.save();

    res.status(200).json({ message: "Product removed from wishlist", wishlist: user.wishlist });
  } catch (error) {
    console.error("Error in removeFromWishlist controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getWishlist(req, res) {
  try {
    // we're using populate, bc wishlist is just an array of product ids
    const user = await User.findById(req.user._id).populate("wishlist");

    res.status(200).json({ wishlist: user.wishlist });
  } catch (error) {
    console.error("Error in getWishlist controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
