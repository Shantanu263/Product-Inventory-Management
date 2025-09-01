import React, { useEffect, useState } from "react";
import { fetchCategories, addProduct } from "../api";
import { useNavigate } from "react-router-dom";

const AddProductForm = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
    categoryId: "",
    productDescription: "",
  });
  const [displayImageFile, setDisplayImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories().then(({ data }) => setCategories(data));
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.price || parseFloat(form.price) <= 0)
      newErrors.price = "Price must be greater than 0";
    if (!form.quantity || parseInt(form.quantity) < 1)
      newErrors.quantity = "Minimum quantity must be 1";
    if (!form.categoryId) newErrors.categoryId = "Category must be selected";
    if (!form.productDescription.trim())
      newErrors.productDescription = "Product description is required";
    if (!displayImageFile) newErrors.displayImage = "Display image is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = new FormData();
    // Convert string values to appropriate types
    const productDTO = {
      ...form,
      price: Number(form.price),
      quantity: Number(form.quantity),
      categoryId: Number(form.categoryId)
    };
    
    formData.append(
      "productDTO",
      new Blob([JSON.stringify(productDTO)], { type: "application/json" })
    );
    formData.append("image", displayImageFile);

    try {
      await addProduct(formData);
      alert("Product added successfully!");
      navigate("/");
    } catch (err) {
      console.error("Failed to add product:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to add product";
      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-base-200 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-8">Add Product</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="grid grid-cols-3 gap-4 items-center">
            <label className="text-right font-medium">Name:</label>
            <div className="col-span-2">
              <input
                className="input input-bordered w-full"
                placeholder="Product Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="grid grid-cols-3 gap-4 items-center">
            <label className="text-right font-medium">Price:</label>
            <div className="col-span-2">
              <input
                type="number"
                className="input input-bordered w-full"
                placeholder="Price"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
              )}
            </div>
          </div>

          {/* Quantity */}
          <div className="grid grid-cols-3 gap-4 items-center">
            <label className="text-right font-medium">Quantity:</label>
            <div className="col-span-2">
              <input
                type="number"
                className="input input-bordered w-full"
                placeholder="Quantity"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="grid grid-cols-3 gap-4 items-center">
            <label className="text-right font-medium">Category:</label>
            <div className="col-span-2">
              <select
                className="select select-bordered w-full"
                value={form.categoryId}
                onChange={(e) =>
                  setForm({ ...form, categoryId: e.target.value })
                }
              >
                <option disabled value="">
                  Select Category
                </option>
                {categories.map((c) => (
                  <option key={c.categoryId} value={c.categoryId}>
                    {c.categoryName}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>
              )}
            </div>
          </div>

          {/* Product Description */}
          <div className="grid grid-cols-3 gap-4 items-start">
            <label className="text-right font-medium">Description:</label>
            <div className="col-span-2">
              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="Product description..."
                value={form.productDescription}
                onChange={(e) =>
                  setForm({ ...form, productDescription: e.target.value })
                }
              />
              {errors.productDescription && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.productDescription}
                </p>
              )}
            </div>
          </div>

          {/* Display Image */}
          <div className="grid grid-cols-3 gap-4 items-center">
            <label className="text-right font-medium">Display Image:</label>
            <div className="col-span-2">
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full"
                onChange={(e) => setDisplayImageFile(e.target.files[0])}
              />
              {errors.displayImage && (
                <p className="text-red-500 text-sm mt-1">{errors.displayImage}</p>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="text-center pt-4">
            <button type="submit" className="btn btn-primary w-1/2">
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductForm;
