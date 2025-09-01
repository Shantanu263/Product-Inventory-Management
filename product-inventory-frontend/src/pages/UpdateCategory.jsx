import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL, fetchCategoryById, updateCategoryById } from "../api";

export default function UpdateCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    categoryName: "",
    categoryDescription: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCategoryById(id).then(res => {
        setFormData({
          categoryName: res.data.categoryName,
          categoryDescription: res.data.categoryDescription,
        });
        setCurrentImageUrl(res.data.imageUrl || "");
      })
      .catch(err => console.error("Error fetching category:", err));
  }, [id]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      const formDataToSend = new FormData();
      
      // Create categoryDTO object
      const categoryDTO = {
        categoryName: formData.categoryName,
        categoryDescription: formData.categoryDescription,
      };
      
      // Append categoryDTO as JSON string
      formDataToSend.append('categoryDTO', new Blob([JSON.stringify(categoryDTO)], {
        type: 'application/json'
      }));
      
      // Append image file only if a new image is selected
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }

      await updateCategoryById(id, formDataToSend);
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
            validationErrors.image = msg;
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

          {/* Image Upload */}
          <div className="flex items-start gap-4">
            <label className="w-[123px] text-right font-medium">Image:</label>
            <div className="flex-1 space-y-4">
              {/* Current Image Display */}
              {currentImageUrl && !imagePreview && (
                <div>
                  <p className="text-sm font-medium mb-2">Current Image:</p>
                  <img
                    src={currentImageUrl}
                    alt="Current category"
                    className="max-w-xs max-h-48 object-contain rounded-lg border"
                  />
                </div>
              )}
              
              {/* File Upload */}
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full"
                onChange={handleImageChange}
              />
              
              {/* New Image Preview */}
              {imagePreview && (
                <div>
                  <p className="text-sm font-medium mb-2">New Image Preview:</p>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-xs max-h-48 object-contain rounded-lg border"
                  />
                </div>
              )}
            </div>
          </div>
          {errors.image && (
            <p className="text-red-500 ml-44 -mt-3">{errors.image}</p>
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
