import { Product } from "@/types";
import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useWishlist from "@/hooks/useWishlist";
import useCart from "@/hooks/useCart";

interface ProductsGridProps {
  isLoading: boolean;
  isError: boolean;
  products: Product[];
}

/**
 * Why use FlatList instead of .map()?
 *
 * 1. PERFORMANCE OPTIMIZATION:
 *    - FlatList only renders items that are currently visible on screen (virtualization)
 *    - .map() renders ALL items at once, even those off-screen, causing memory issues with large lists
 *
 * 2. MEMORY EFFICIENCY:
 *    - FlatList recycles components as you scroll, reusing existing views instead of creating new ones
 *    - .map() creates all components upfront, consuming more memory especially with images
 *
 * 3. SCROLL PERFORMANCE:
 *    - FlatList is optimized for smooth scrolling with built-in optimizations
 *    - .map() can cause janky scrolling as all items are in the view hierarchy
 *
 * 4. LAZY LOADING:
 *    - FlatList supports lazy loading of images and data as you scroll
 *    - .map() loads everything immediately, slowing initial render
 *
 * 5. BUILT-IN FEATURES:
 *    - Pull-to-refresh, infinite scroll, section headers, separators come built-in
 *    - .map() requires manual implementation of these features
 *
 * 6. KEY EXTRACTION:
 *    - FlatList handles key extraction efficiently with getItemKey or keyExtractor
 *    - .map() requires manual key management which can cause React warnings
 */
export default function ProductsGrid({
  products,
  isLoading,
  isError,
}: ProductsGridProps) {
  const {
    isInWishlist,
    toggleWishlist,
    isAddingToWishlist,
    isRemovingFromWishlist,
  } = useWishlist();
  const { addToCart, isAddingToCart } = useCart();

  // WISHLIST LOADING FIX: Track which specific product is being added/removed from wishlist
  // This prevents all products from showing loading indicator when only one is being processed
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);
   
  // CART LOADING FIX: Track which specific product is being added to cart
  // This prevents all products from showing loading indicator when only one is being processed
  const [addingToCartProductId, setAddingToCartProductId] = useState<string | null>(null);

  // CART FIX: Handle add to cart with proper error handling and per-product loading state
  const handleAddToCart = (productId: string, productName: string) => {
    setAddingToCartProductId(productId); // Set loading state for this specific product
    
    addToCart(
      { productId, quantity: 1 },
      {
        onSuccess: () => {
          Alert.alert("Success", `${productName} added to cart!`);
          setAddingToCartProductId(null); // Reset loading state on success
        },
        onError: (error: any) => {
          // CART FIX: Properly handle error response from API
          const errorMessage = error?.response?.data?.error || error?.message || "Failed to add to cart";
          Alert.alert("Error", errorMessage);
          setAddingToCartProductId(null); // Reset loading state on error
        },
      }
    );
  };

  // WISHLIST LOADING FIX: Handle wishlist toggle with per-product loading state
  // Only the clicked product will show loading indicator, not all products
  const handleToggleWishlist = (productId: string) => {
    setLoadingProductId(productId); // Set loading state for this specific product
    toggleWishlist(productId);

    // Reset loading state after mutation completes
    // Using a timeout to allow the mutation to process and update the UI
    setTimeout(() => {
      setLoadingProductId(null);
    }, 1000); // Increased timeout to ensure mutation completes
  };

  const renderProduct = ({ item: product }: { item: Product }) => (
    <TouchableOpacity
      className="bg-surface rounded-3xl overflow-hidden"
      // SPACING FIX: Using flex: 1 with maxWidth to ensure items take equal space
      // The columnWrapperStyle handles horizontal spacing, so we use flex for equal distribution
      style={{
        flex: 1,
        maxWidth: "48%", // Prevents items from getting too wide
        marginBottom: 12, // Vertical spacing between rows (spacing between different rows)
      }}
      activeOpacity={0.8}
      onPress={() => router.push(`/product/${product._id}` as any)}
    >
      <View className="relative">
        {/* the product image */}
        <Image
          // we use uri because image is coming from a remote url
          source={{ uri: product.images?.[0] ?? '' }}
          className="w-full h-44 bg-background-lighter"
          resizeMode="cover"
        />

        <TouchableOpacity
          className="absolute top-3 right-3 bg-black/30 backdrop-blur-xl p-2 rounded-full"
          activeOpacity={0.7}
          onPress={() => handleToggleWishlist(product._id)}
          // WISHLIST LOADING FIX: Only disable this specific product's button when it's loading
          disabled={loadingProductId === product._id}
        >
          {/* WISHLIST LOADING FIX: Only show loading indicator for the specific product being processed */}
          {loadingProductId === product._id ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons
              name={isInWishlist(product._id) ? "heart" : "heart-outline"}
              size={18}
              color={isInWishlist(product._id) ? "#FF6B6B" : "#FFFFFF"}
            />
          )}
        </TouchableOpacity>
      </View>

      <View className="p-3">
        <Text className="text-text-secondary text-xs mb-1">
          {product.category}
        </Text>
        <Text
          className="text-text-primary font-bold text-sm mb-2"
          numberOfLines={2}
        >
          {product.name}
        </Text>

        <View className="flex-row items-center mb-2">
          <Ionicons name="star" size={12} color="#FFC107" />
          <Text className="text-text-primary text-xs font-semibold ml-1">
            {product.averageRating.toFixed(1)}
          </Text>
          <Text className="text-text-secondary text-xs ml-1">
            ({product.totalReviews})
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="text-primary font-bold text-lg">
            ${product.price.toFixed(2)}
          </Text>

          <TouchableOpacity
            className="bg-primary rounded-full w-8 h-8 items-center justify-center"
            activeOpacity={0.7}
            onPress={() => handleAddToCart(product._id, product.name)}
            // CART LOADING FIX: Only disable this specific product's button when it's being added to cart
            disabled={addingToCartProductId === product._id}
          >
            {/* CART LOADING FIX: Only show loading indicator for the specific product being added to cart */}
            {addingToCartProductId === product._id ? (
              <ActivityIndicator size="small" color="#121212" />
            ) : (
              <Ionicons name="add" size={18} color="#121212" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  // LOADING STATE FIX: Show loading indicator when products are being fetched
  // Only show "No products found" when loading is complete and products array is empty
  if (isLoading) {
    return (
      <View className="py-20 items-center justify-center">
        <ActivityIndicator size="small" color="#1DB954" />
        <Text className="text-text-secondary text-sm mt-4">Loading products...</Text>
      </View>
    );
  }

  // FlatList is the recommended way to render lists in React Native
  // It provides virtualization, better performance, and built-in optimizations
  return (
    <FlatList
      data={products}
      renderItem={renderProduct}
      keyExtractor={(item) => item._id}
      // we added this code directly under this comment is because in the products page the ProductsGrid was called in a scrollview component and we were getting the error related to virtualized lists shouldn't be in scroll view
      scrollEnabled={false}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      // LOADING STATE FIX: Only show "No products found" when not loading and products array is empty
      ListEmptyComponent={NoProductsFound}
      // SPACING FIX: columnWrapperStyle adds spacing between columns (horizontal gap between items in the same row)
      // This ensures proper horizontal spacing when using numColumns={2}
      columnWrapperStyle={{
        paddingHorizontal: 4, // Padding on left and right of the entire row
        justifyContent: "space-between", // SPACING FIX: Distributes items with equal space between them
        // This creates consistent horizontal spacing between the two items in each row
      }}
      // SPACING FIX: contentContainerStyle adds padding to the entire list container
      // This ensures the first and last items have proper spacing from the edges
      contentContainerStyle={{
        paddingBottom: 8, // Extra padding at the bottom of the list
      }}
    />
  );
}

function NoProductsFound() {
  return (
    <View className="py-20 items-center justify-center">
      <Ionicons name="search-outline" size={48} color={"#666"} />
      <Text className="text-text-primary font-semibold mt-4">
        No products found
      </Text>
      <Text className="text-text-secondary text-sm mt-2">
        Try adjusting your filters
      </Text>
    </View>
  );
}
