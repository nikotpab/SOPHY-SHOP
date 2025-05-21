import { useState, useEffect } from 'react';

const useProducts = () => {
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('products');
    return savedProducts ? JSON.parse(savedProducts) : [];
  });

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const addProduct = (newProduct) => {
    setProducts(prev => [...prev, {
      ...newProduct,
      id: Date.now(),
      price: parseFloat(newProduct.price),
      icon: newProduct.image
    }]);
  };

  return { products, addProduct };
};

export default useProducts;