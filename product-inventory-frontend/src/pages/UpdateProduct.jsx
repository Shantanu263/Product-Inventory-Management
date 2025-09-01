import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProductById, updateProductById, fetchCategories } from "../api";

export default function UpdateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [product, setProduct] = useState({
    name: "",
    price: "",
    quantity: "",
    productDescription: "",
    imageUrl: "",
    categoryId: "",
  });

  useEffect(() => {
    fetchProductById(id)
      .then(res => {
        const p = res.data;
        console.log("Received product data:", p);
        setProduct({
          name: p.name,
          price: p.price,
          quantity: p.quantity,
          productDescription: p.productDescription || "",
          imageUrl: p.imageUrl || "",
          categoryId: p.category?.categoryId || "",
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

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Current product state:", product);

    // Convert string values to appropriate types
    const productDTO = {
      name: product.name,
      price: Number(product.price),
      quantity: Number(product.quantity),
      productDescription: product.productDescription,
      categoryId: Number(product.categoryId),
    };
    
    console.log("Sending productDTO:", productDTO);

    const formData = new FormData();
    
    // Create a Blob with the correct content type
    const productDTOBlob = new Blob([JSON.stringify(productDTO)], {
      type: 'application/json'
    });
    
    // Append as a part named "productDTO"
    formData.append("productDTO", productDTOBlob);

    // Append image if present
    if (imageFile) {
      formData.append("image", imageFile);
    }

    updateProductById(id, formData)
      .then(() => {
        alert("Product updated successfully!");
        navigate(`/product/${id}`);
      })
      .catch(err => {
        console.error("Failed to update product:", err);
        const errorMessage = err.response?.data?.message || err.message || "Failed to update product";
        alert(errorMessage);
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
              name="productDescription"
              value={product.productDescription}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
              rows="3"
            />
          </div>

          {/* Current Display Image */}
          {product.imageUrl && (
            <div className="flex items-center gap-4">
              <label className="w-[128px] text-right font-medium">Current Image:</label>
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
            {/* <p className="text-sm text-gray-500">
              {product.imageUrl ? "Leave empty to keep current image" : "Upload a new image"}
            </p> */}
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
