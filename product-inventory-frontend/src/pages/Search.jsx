import { useEffect, useState } from 'react';
import { searchProducts } from '../api';
import ProductCard from '../components/ProductCard';
import { useSearchParams } from 'react-router-dom';

const Search = () => {
  const [params] = useSearchParams();
  const name = params.get('name');
  const [page, setPage] = useState(0);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const loadResults = async () => {
    try {
      const { data } = await searchProducts(name, page, 15, 'id', 'asc');
      setProducts(data.content);
      setTotalPages(data.totalPages);
    } catch {
      setProducts([]);
    }
  };

  useEffect(() => {
    loadResults();
  }, [name, page]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Search Results for "{name}"</h2>
      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="mt-6 flex justify-center gap-4">
            <button className="btn" onClick={() => setPage(p => Math.max(p - 1, 0))} disabled={page === 0}>Previous</button>
            <button className="btn" onClick={() => setPage(p => Math.min(p + 1, totalPages - 1))} disabled={page >= totalPages - 1}>Next</button>
          </div>
        </>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};

export default Search;

