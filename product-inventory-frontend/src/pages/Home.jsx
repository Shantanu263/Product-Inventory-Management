import React, { useEffect, useState, useRef} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchProducts, fetchCategories } from '../api';
import ProductCard from '../components/ProductCard';
import axios from 'axios';
import LayoutWrapper from '../components/LayoutWrapper';


const Home = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('id');
  const [order, setOrder] = useState('asc');
  const [uploadResponse, setUploadResponse] = useState(null);
  const fileInputRef = useRef();
  const categoryContainerRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const navigate = useNavigate();

  const loadCategories = async () => {
    try {
      setIsLoadingCategories(true);
      const { data } = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const loadProducts = async () => {
    const { data } = await fetchProducts(page, 15, sortBy, order);
    setProducts(data.content);
    setTotalPages(data.totalPages);
  };

  useEffect(() => {
    loadProducts();
  }, [page, sortBy, order]);

    useEffect(() => {
      loadCategories();
    }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await axios.post('/api/products/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadResponse(data);
      alert("Upload complete!");
      loadProducts(); // Refresh product list
    } catch (error) {
      alert("Upload failed: " + (error.response?.data || error.message));
    } finally {
      e.target.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <LayoutWrapper>
    <div className="w-full min-h-screen flex flex-col overflow-x-hidden">
      <div className="w-full px-6 py-8"> {/*//rmd px-4*/}


        {/* Upload Summary */}
        {uploadResponse && (
          <div className="alert alert-info shadow-lg mb-4 relative">
            <button
              className="absolute top-2 right-2 btn btn-xs btn-circle btn-ghost text-lg"
              onClick={() => setUploadResponse(null)}
            >
              ×
            </button>
            <div>
              <span>
                <strong>Upload Summary:</strong><br />
                ✅ Imported: {uploadResponse.successfullyImported}<br />
                ⏭️ Skipped: {uploadResponse.skipped}<br />
                ⚠️ Errors: {uploadResponse.errors?.length || 0}
              </span>
              {uploadResponse.errors?.length > 0 && (
                <ul className="mt-2 list-disc ml-5 text-sm text-red-600">
                  {uploadResponse.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Category Scroller */}
<div className="relative w-full mb-8 group">
<button
  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-base-200 text-base-content text-2xl p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow hover:bg-base-300"
  onClick={() => (categoryContainerRef.current.scrollLeft -= 200)}
>
  ‹
</button>
<button
  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-base-200 text-base-content text-2xl p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow hover:bg-base-300"
  onClick={() => (categoryContainerRef.current.scrollLeft += 200)}
>
  ›
</button>

  <div
  ref={categoryContainerRef}
  className="flex justify-center overflow-x-auto gap-8 px-10 py-3 no-scrollbar scroll-smooth"
>
  <div className="flex gap-8">
    {isLoadingCategories ? (
      <div className="flex justify-center w-full">
        <div className="loading loading-spinner loading-md"></div>
      </div>
    ) : categories.map(category => (
      <div
  key={category.categoryId}
  onClick={() => navigate(`/category/${category.categoryId}`)}
  className="flex flex-col items-center text-center min-w-[80px] cursor-pointer transform transition duration-300 hover:scale-105"
>
  <div className="w-16 h-16 rounded-xl bg-purple-100 flex items-center justify-center overflow-hidden">
    <img
      src={category.imageUrl}
      alt={category.categoryName}
      className="w-10 h-10 object-contain"
    />
  </div>
  <span className="text-sm font-medium mt-2">{category.categoryName}</span>
</div>
    ))}
  </div>
</div>
{categories.length === 0 && !isLoadingCategories && (
  <div className="text-center text-gray-500">
    No categories found
  </div>
)}
</div>

<hr className="border-t border-dashed border-gray-400 dark:border-gray-600 my-6" />




      {/* Control Bar */}
<div className="flex justify-between items-center mb-6">
  <h3 className="text-2xl font-semibold">All Products</h3>
  {/* Right Dropdowns */}
  <div className="flex gap-3">
    <select
      className="select select-bordered"
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
    >
      <option value="id">Sort by ID</option>
      <option value="name">Sort by Name</option>
      <option value="price">Sort by Price</option>
      <option value="quantity">Sort by Quantity</option>
    </select>
    <select
      className="select select-bordered"
      value={order}
      onChange={(e) => setOrder(e.target.value)}
    >
      <option value="asc">Order: Ascending</option>
      <option value="desc">Order: Descending</option>
    </select>
  </div>
</div>

        


        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            className="btn"
            onClick={() => setPage(p => Math.max(p - 1, 0))}
            disabled={page === 0}
          >
            Previous
          </button>
          <button
            className="btn"
            onClick={() => setPage(p => Math.min(p + 1, totalPages - 1))}
            disabled={page >= totalPages - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
    </LayoutWrapper>
          
  );
};

export default Home;
