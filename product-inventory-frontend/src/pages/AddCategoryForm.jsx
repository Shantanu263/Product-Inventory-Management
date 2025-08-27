import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCategory } from '../api';

const AddCategoryForm = () => {
  const [form, setForm] = useState({
    categoryName: '',
    categoryDescription: '',
    imageUrl: '', // Added Image URL field
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCategory(form);
      navigate('/');
    } catch (error) {
      console.error('Failed to add category:', error);
      alert('Failed to add category. Please check your inputs.');
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-base-200 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-8">Add Category</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Name */}
          <div className="grid grid-cols-3 gap-4 items-center">
            <label className="text-right font-medium">Name:</label>
            <input
              type="text"
              className="input input-bordered col-span-2"
              placeholder="Category Name"
              required
              value={form.categoryName}
              onChange={(e) =>
                setForm({ ...form, categoryName: e.target.value })
              }
            />
          </div>

          {/* Category Description */}
          <div className="grid grid-cols-3 gap-4 items-start">
            <label className="text-right font-medium mt-1">Description:</label>
            <textarea
              className="textarea textarea-bordered col-span-2"
              placeholder="Category Description"
              rows={4}
              maxLength={500}
              required
              value={form.categoryDescription}
              onChange={(e) =>
                setForm({ ...form, categoryDescription: e.target.value })
              }
            ></textarea>
          </div>

          {/* Image URL */}
          <div className="grid grid-cols-3 gap-4 items-center">
            <label className="text-right font-medium">Image URL:</label>
            <input
              type="text"
              className="input input-bordered col-span-2"
              placeholder="https://example.com/image.jpg"
              value={form.imageUrl}
              onChange={(e) =>
                setForm({ ...form, imageUrl: e.target.value })
              }
            />
          </div>

          <div className="text-center pt-4">
            <button type="submit" className="btn btn-primary w-1/2">
              Add Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryForm;
