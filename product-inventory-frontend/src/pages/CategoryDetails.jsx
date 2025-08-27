import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchCategoryById, deleteCategory } from "../api";
import ProductCard from "../components/ProductCard";
import LayoutWrapper from '../components/LayoutWrapper';
import { BASE_URL } from "../api";


export default function CategoryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 15,
    sortBy: "id",
    order: "asc",
    totalPages: 0,
  });

  useEffect(() => {
    fetchCategoryDetails();
  }, [id]);

  useEffect(() => {
    fetchProducts();
  }, [id, pagination.pageNumber, pagination.sortBy, pagination.order]);

  const fetchCategoryDetails = async () => {
    try {
      const res = await fetchCategoryById(id);
      setCategory(res.data);
    } catch (err) {
      console.error("Error fetching category:", err);
      if (err.response?.status === 403) {
        navigate('/login');
      }
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/products/category/${id}?pageNumber=${pagination.pageNumber}&pageSize=${pagination.pageSize}&sortBy=${pagination.sortBy}&order=${pagination.order}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );
      if (!response.ok) {
        if (response.status === 403) {
          navigate('/login');
          return;
        }
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setProducts(data.content);
      setPagination((prev) => ({
        ...prev,
        totalPages: data.totalPages,
      }));
    } catch (err) {
      console.error("Error fetching products:", err);
      if (err.response?.status === 403) {
        navigate('/login');
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id);
        alert("Category deleted");
        navigate("/");
      } catch (err) {
        console.error("Failed to delete category:", err);
        if (err.response?.status === 403) {
          navigate('/login');
        } else {
          alert("Products exist in this category. Cannot delete.");
        }
      }
    }
  };

  return (
    <LayoutWrapper>
    <div className="min-h-screen w-full bg-base-100 px-6 py-8">
      {category && (
        <div className="bg-base-200 p-6 rounded-lg shadow-md mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold">{category.categoryName}</h2>
            <div className="space-x-2">
              <button
                className="btn btn-sm btn-info"
                onClick={() => navigate(`/update-category/${id}`)}
              >
                Edit
              </button>
              <button className="btn btn-sm btn-error" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
          <p className="mt-2 text-lg text-gray-600">
            {category.categoryDescription}
          </p>
        </div>
      )}

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold">Products in this Category</h3>
          <div className="flex space-x-2">
            <select
              className="select select-bordered"
              value={pagination.sortBy}
              onChange={(e) =>
                setPagination({ ...pagination, sortBy: e.target.value })
              }
            >
              <option value="id">Sort by ID</option>
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="quantity">Sort by Quantity</option>
            </select>
            <select
              className="select select-bordered"
              value={pagination.order}
              onChange={(e) =>
                setPagination({ ...pagination, order: e.target.value })
              }
            >
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 px-2 sm:px-4">
          {products.length > 0 ? (
            products.map((p) => <ProductCard key={p.id} product={p} />)
          ) : (
            <p className="text-gray-500 col-span-full">No products found.</p>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6 space-x-2">
          {[...Array(pagination.totalPages).keys()].map((page) => (
            <button
              key={page}
              onClick={() =>
                setPagination({ ...pagination, pageNumber: page })
              }
              className={`btn btn-sm ${
                pagination.pageNumber === page ? "btn-active btn-primary" : ""
              }`}
            >
              {page + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
    </LayoutWrapper>
  );
}
