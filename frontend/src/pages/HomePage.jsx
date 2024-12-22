import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";

const categories = [
  { href: "/Soup", name: "Soup", imageUrl: "/Afang.jpeg" },
  {
    href: "/Protein",
    name: "Protein",
    imageUrl: "/Beans.jpeg",
  },
  // { href: "/egusi-soup", name: "Egusi soup", imageUrl: "/Egusi.jpg" },
  { href: "/Carbohydrate", name: "Carbohydrate", imageUrl: "/Moimoi.jpeg" },
  { href: "/Fats and Oil", name: "Fats and Oil", imageUrl: "/Nkwobi.jpeg" },
  { href: "/Lunch", name: "Lunch", imageUrl: "/Oha.jpeg" },
  { href: "/Breakfast", name: "Breakfast", imageUrl: "/Okpa.jpeg" },
  { href: "/Dinner", name: "Dinner", imageUrl: "/Okro.jpeg" },
  { href: "/Desserts", name: "Desserts", imageUrl: "/Plantain.jpeg" },
  { href: "/local-dishes", name: "local-dishes", imageUrl: "/Porridge.jpg" },
];

const HomePage = () => {
  const { fetchFeaturedProducts, products, isLoading } = useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4">
          Categories
        </h1>
        <p className="text-center text-xl text-gray-300 mb-12">
          Discover our local delicacies
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <CategoryItem category={category} key={category.name} />
          ))}
        </div>

        {!isLoading && products.length > 0 && (
          <FeaturedProducts featuredProducts={products} />
        )}
      </div>
    </div>
  );
};
export default HomePage;