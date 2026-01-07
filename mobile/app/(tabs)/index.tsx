import SafeScreen from "@/components/safescreen";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
} from "react-native";
import ProductsGrid from "@/components/ProductsGrid";
import useProducts from "@/hooks/useProducts";
import * as Sentry from '@sentry/react-native';

// todo: in the payment section use sentry logs to track payment error
function ShopScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const {data:products, isLoading, isError } = useProducts()
  console.log("Products data:", products);

  const filteredProducts = useMemo(() => {
    if(!products){
      return []
    }

    let filtered = products.products 

    // filtering by category 
    if(selectedCategory !== "All"){
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // filtering by searchquery
    // trim function for removing all unneccessary white spaces
    if(searchQuery.trim()){
      // converting all alphabeticals to lowercase 
      filtered = filtered.filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()) )
    }
    return filtered 
  },[products,selectedCategory, searchQuery])
 
  const CATEGORIES = [
    { name: "All", icon: "grid-outline" as const },
    { name: "Electronics", image: require("@/assets/images/electronics.png") },
    { name: "Fashion", image: require("@/assets/images/fashion.png") },
    { name: "Sports", image: require("@/assets/images/sports.png") },
    { name: "Books", image: require("@/assets/images/books.png") },
  ];

  return (
    <SafeScreen>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View className="px-6 pb-4 pt-4">
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-text-primary text-3xl font-bold tracking-tight">
                Shop
              </Text>
              <Text className="text-text-primary text-sm mt-1">
                Browse all products
              </Text>
            </View>

            <TouchableOpacity
              className="bg-surface/50 p-3 rounded-full"
              activeOpacity={0.7}
            >
              <Ionicons name="options-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* SEARCH */}
          <View className="px-6 pb-4 pt-6">
            <View className="flex-row items-center bg-surface/50 rounded-lg px-4 py-2">
              <Ionicons name="search-outline" size={22} color="#666" />
              <TextInput
                placeholder="Search for products"
                placeholderTextColor="#666"
                className="flex-1 ml-3 text-base text-text-primary"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>
        </View>

        {/* CATEGORY FILTER */}
        <View className="mb-6">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category.name;

              return (
                <TouchableOpacity
                  key={category.name}
                  onPress={() => setSelectedCategory(category.name)}
                  className={`mr-3 size-20 rounded-2xl items-center justify-center ${
                    isSelected ? "bg-primary" : "bg-surface"
                  }`}
                >
                  {category.icon ? (
                    <Ionicons
                      name={category.icon}
                      size={36}
                      color={isSelected ? "#121212" : "#fff"}
                    />
                  ) : (
                    <View className="w-10 h-10">
                      <Image
                        source={category.image}
                        className="w-full h-full"
                        resizeMode="contain"
                      />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View className="px-6 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-text-primary text-lg font-bold">Products</Text>
            <Text className="text-text-secondary text-sm"> {filteredProducts.length} items</Text>
          </View>
       
          {/* PRODUCTS GRID*/}
          {/* instead of just passing the results we want to pas the filtered results  */}
            <ProductsGrid products={filteredProducts} isLoading={isLoading} isError={isError} />
        </View>
      </ScrollView>
    </SafeScreen>
  );
}

export default ShopScreen;
