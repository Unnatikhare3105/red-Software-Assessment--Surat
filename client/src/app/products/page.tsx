'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { DashboardLayout } from '@/src/components/layout/DashboardLayout';
import { Spinner } from '@/src/components/ui/Spinner';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { Pagination } from '@/src/components/ui/Pagination';
import { Modal } from '@/src/components/ui/Modal';
import { ConfirmDialog } from '@/src/components/ui/ConfirmDialog';
import { Select } from '@/src/components/ui/Select';
import { ProductForm } from '@/src/components/products/ProductForm';
import { useAppDispatch, useAppSelector } from '@/src/redux/hooks';
import { fetchProducts, createProduct, deleteProduct } from '@/src/thunks/product.thunks';
import { fetchCategories } from '@/src/thunks/category.thunks';
import { ProductPayload, ProductQueryParams } from '@/src/types/product.types';

export default function ProductsPage() {
  const dispatch = useAppDispatch();
//   const { products, pagination, loading } = useAppSelector((state) => state.product);
const { products = [], pagination, loading } = useAppSelector((state) => state.product);
  const { categories } = useAppSelector((state) => state.category);

  const [filters, setFilters] = useState<ProductQueryParams>({ page: 1, limit: 10 });
  const [searchInput, setSearchInput] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => { dispatch(fetchCategories()); }, [dispatch]);
  useEffect(() => { dispatch(fetchProducts(filters)); }, [dispatch, filters]);

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleCreate = async (payload: ProductPayload) => {
    setFormLoading(true);
    const result = await dispatch(createProduct(payload));
    setFormLoading(false);
    if (createProduct.fulfilled.match(result)) {
      toast.success('Product added');
      setIsFormOpen(false);
    } else {
      toast.error((result.payload as string) || 'Failed to add product');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    const result = await dispatch(deleteProduct(deleteTarget));
    setDeleteLoading(false);
    setDeleteTarget(null);
    if (deleteProduct.fulfilled.match(result)) toast.success('Product deleted');
    else toast.error((result.payload as string) || 'Failed to delete product');
  };

  return (
    <DashboardLayout>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Products</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-5 py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 transition shadow-md shadow-indigo-200"
        >
          + Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            placeholder="Search by name or SKU..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-slate-800"
          />
          <select
            value={filters.categoryId ?? ''}
            onChange={(e) => setFilters({ ...filters, categoryId: e.target.value || undefined, page: 1 })}
            className="px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-slate-800 bg-white"
          >
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c.uuid} value={c.uuid}>{c.name}</option>)}
          </select>
          <select
            value={filters.status ?? ''}
            onChange={(e) => setFilters({ ...filters, status: (e.target.value || undefined) as any, page: 1 })}
            className="px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-slate-800 bg-white"
          >
            <option value="">All Status</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
          <select
            value={`${filters.sortBy ?? 'name'}-${filters.sortOrder ?? 'asc'}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              setFilters({ ...filters, sortBy: sortBy as any, sortOrder: sortOrder as any, page: 1 });
            }}
            className="px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-slate-800 bg-white"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="quantity-asc">Quantity (Low-High)</option>
            <option value="quantity-desc">Quantity (High-Low)</option>
            <option value="unitPrice-asc">Price (Low-High)</option>
            <option value="unitPrice-desc">Price (High-Low)</option>
          </select>
        </div>
      </div>

     <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
        {loading ? (
          <Spinner />
        ) : products.length === 0 ? (
          <EmptyState title="No products found" subtitle="Try adjusting filters or add a new product" />
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">SKU</th>
                <th className="px-6 py-3 font-medium">Quantity</th>
                <th className="px-6 py-3 font-medium">Price</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p: any) => (
                <tr key={p.uuid} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-3 text-slate-800 font-medium">{p.name}</td>
                  <td className="px-6 py-3 text-slate-500">{p.sku}</td>
                  <td className="px-6 py-3 text-slate-600">{p.quantity}</td>
                  <td className="px-6 py-3 text-slate-600">₹{p.unitPrice}</td>
                  <td className="px-6 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-6 py-3 text-right space-x-3">
                    <Link href={`/products/${p.uuid}`} className="text-indigo-600 hover:underline">View</Link>
                    <button onClick={() => setDeleteTarget(p.uuid)} className="text-red-500 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* <Pagination page={pagination.page} totalPages={pagination.totalPages}
        onPageChange={(page) => setFilters({ ...filters, page })} /> */}

        {pagination && (
  <Pagination page={pagination.page} totalPages={pagination.totalPages}
    onPageChange={(page) => setFilters({ ...filters, page })} />
)}

      <Modal title="Add Product" isOpen={isFormOpen} onClose={() => setIsFormOpen(false)}>
        <ProductForm onSubmit={handleCreate} loading={formLoading} />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Product"
        message="This action cannot be undone. Are you sure?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteLoading}
      />
    </DashboardLayout>
  );
}