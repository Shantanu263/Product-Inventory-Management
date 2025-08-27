import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProductById, updateProductById, fetchCategories } from "../api";

export default function UpdateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [product, setProduct] = useState({
    name: "",
    price: "",
    quantity: "",
    description: "",
    imageUrl: "",
    categoryId: "",
    galleryImages: []
  });
  const [removedGalleryIds, setRemovedGalleryIds] = useState([]);

  useEffect(() => {
    fetchProductById(id)
      .then(res => {
        const p = res.data;
        setProduct({
          name: p.name,
          price: p.price,
          quantity: p.quantity,
          description: p.productDescription || "",
          imageUrl: p.imageUrl || "",
          categoryId: p.category?.categoryId || "",
          galleryImages: p.galleryImages || []
        });
      })
      .catch(err => console.error("Failed to load product:", err));

    fetchCategories()
      .then(res => setCategories(res.data))
      .catch(err => console.error("Failed to load categories:", err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleRemoveGallery = (imgId) => {
    setRemovedGalleryIds(prev => [...prev, imgId]);
    setProduct(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter(img => img.id !== imgId)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    const productDTO = {
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      productDescription: product.description,
      categoryId: product.categoryId,
      removedGalleryIds: removedGalleryIds
    };

    formData.append(
      "productDTO",
      new Blob([JSON.stringify(productDTO)], { type: "application/json" })
    );

    if (imageFile) formData.append("image", imageFile);
    galleryFiles.forEach(file => formData.append("galleryImages", file));

    updateProductById(id, formData)
      .then(() => {
        alert("Product updated successfully!");
        navigate(`/product/${id}`);
      })
      .catch(err => {
        console.error("Failed to update product:", err);
        alert("Failed to update. Check console for errors.");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 px-4">
      <div className="w-full max-w-3xl bg-base-200 p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Update Product</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="flex items-center gap-4">
            <label className="w-40 text-right font-medium">Name:</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            <label className="w-40 text-right font-medium">Price:</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <label className="w-40 text-right font-medium">Quantity:</label>
            <input
              type="number"
              name="quantity"
              value={product.quantity}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          {/* Description */}
          <div className="flex items-start gap-4">
            <label className="w-40 text-right font-medium">Description:</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
              rows="3"
            />
          </div>

          {/* Current Display Image */}
{product.imageUrl && (
  <div className="flex items-center gap-4">
    <label className="w-40 text-right font-medium">Current Image:</label>
    <img src={product.imageUrl} alt="Current" className="w-24 h-24 object-cover rounded" />
  </div>
)}

          {/* Upload New Display Image */}
          <div className="flex items-center gap-4">
            <label className="w-40 text-right font-medium">New Image:</label>
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </div>

          {/* Gallery Images */}
<div className="flex items-start gap-4">
  <label className="w-40 text-right font-medium mt-2">Gallery Images:</label>
  <div className="flex flex-col gap-2 w-full">
    {/* Existing Gallery */}
    <div className="flex gap-2 flex-wrap">
      {product.galleryImages.map(img => (
        <div key={img.id} className="relative group">
          <img src={img.imageUrl} alt="Gallery" className="w-24 h-24 object-cover rounded" />
          <button
            type="button"
            onClick={() => handleRemoveGallery(img.id)}
            className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
    {/* Add New Gallery */}
    <input
      type="file"
      accept="image/*"
      multiple
      className="file-input file-input-bordered w-full mt-2"
      onChange={(e) => setGalleryFiles(Array.from(e.target.files))}
    />
  </div>
</div>

          {/* Category */}
          <div className="flex items-center gap-4">
            <label className="w-40 text-right font-medium">Category:</label>
            <select
              name="categoryId"
              className="select select-bordered w-full"
              value={product.categoryId}
              onChange={handleChange}
            >
              <option value="">-- Select Category --</option>
              {categories.map(cat => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <div className="text-center pt-4">
            <button type="submit" className="btn btn-primary w-1/2">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
