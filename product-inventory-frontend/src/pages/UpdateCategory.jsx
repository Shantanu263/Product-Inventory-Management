import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL, fetchCategoryById } from "../api";

export default function UpdateCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    categoryName: "",
    categoryDescription: "",
    imageUrl: "", 
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCategoryById(id).then(res => {
        setFormData({
          categoryName: res.data.categoryName,
          categoryDescription: res.data.categoryDescription,
          imageUrl: res.data.imageUrl || "", // Set fetched image URL
        });
      })
      .catch(err => console.error("Error fetching category:", err));
  }, [id]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      await axios.put(`${BASE_URL}/categories/${id}`, formData);
      alert("Category updated successfully!");
      navigate(`/category/${id}`);
    } catch (err) {
      console.error("Error updating category:", err);
      if (err.response?.data) {
        const validationErrors = {};
        err.response.data.forEach(msg => {
          const lower = msg.toLowerCase();
          if (lower.includes("name")) {
            validationErrors.categoryName = msg;
          } else if (lower.includes("description")) {
            validationErrors.categoryDescription = msg;
          } else if (lower.includes("image")) {
            validationErrors.imageUrl = msg;
          }
        });
        setErrors(validationErrors);
      } else {
        alert("Update failed");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 px-4">
      <div className="w-full max-w-2xl bg-base-200 p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Category</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Category Name */}
          <div className="flex items-center gap-4">
            <label className="w-40 text-right font-medium">Name:</label>
            <input
              type="text"
              name="categoryName"
              value={formData.categoryName}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          {errors.categoryName && (
            <p className="text-red-500 ml-44 -mt-3">{errors.categoryName}</p>
          )}

          {/* Description */}
          <div className="flex items-center gap-4">
            <label className="w-40 text-right font-medium">Description:</label>
            <textarea
              name="categoryDescription"
              value={formData.categoryDescription}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
              rows={4}
            />
          </div>
          {errors.categoryDescription && (
            <p className="text-red-500 ml-44 -mt-3">{errors.categoryDescription}</p>
          )}

          {/* Image URL */}
          <div className="flex items-center gap-4">
            <label className="w-40 text-right font-medium">Image URL:</label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          {errors.imageUrl && (
            <p className="text-red-500 ml-44 -mt-3">{errors.imageUrl}</p>
          )}

          <div className="text-center pt-4">
            <button type="submit" className="btn btn-primary w-1/2">
              Update Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
