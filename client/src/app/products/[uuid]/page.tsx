'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { DashboardLayout } from '@/src/components/layout/DashboardLayout';
import { Spinner } from '@/src/components/ui/Spinner';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { Modal } from '@/src/components/ui/Modal';
import { ConfirmDialog } from '@/src/components/ui/ConfirmDialog';
import { ProductForm } from '@/src/components/products/ProductForm';
import { StockAdjustModal } from '@/src/components/products/StockAdjustModal';
import { useAppDispatch, useAppSelector } from '@/src/redux/hooks';
import { fetchProductById, updateProduct, deleteProduct } from '@/src/thunks/product.thunks';
import { fetchCategories } from '@/src/thunks/category.thunks';
import { clearSelectedProduct } from '@/src/redux/slices/product.slice';
import { ProductPayload } from '@/src/types/product.types';

export default function ProductDetailPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { selectedProduct, loading } = useAppSelector((state) => state.product);
  const { categories } = useAppSelector((state) => state.category);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isStockOpen, setIsStockOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProductById(uuid));
    return () => { dispatch(clearSelectedProduct()); };
  }, [dispatch, uuid]);

  const handleUpdate = async (payload: ProductPayload) => {
    setEditLoading(true);
    const result = await dispatch(updateProduct({ uuid, payload }));
    setEditLoading(false);
    if (updateProduct.fulfilled.match(result)) {
      toast.success('Product updated');
      setIsEditOpen(false);
    } else {
      toast.error((result.payload as string) || 'Failed to update product');
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    const result = await dispatch(deleteProduct(uuid));
    setDeleteLoading(false);
    if (deleteProduct.fulfilled.match(result)) {
      toast.success('Product deleted');
      router.push('/products');
    } else {
      toast.error((result.payload as string) || 'Failed to delete product');
    }
  };

  const categoryName = categories.find((c) => c.uuid === selectedProduct?.categoryId)?.name || 'Uncategorized';

  if (loading || !selectedProduct) {
    return <DashboardLayout><Spinner /></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <button onClick={() => router.push('/products')} className="text-sm text-indigo-600 hover:underline mb-4">
        ← Back to Products
      </button>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">{selectedProduct.name}</h1>
            <p className="text-slate-400 text-sm mt-1">SKU: {selectedProduct.sku}</p>
          </div>
          <StatusBadge status={selectedProduct.status} />
        </div>

       <div className="flex flex-wrap gap-3">
          <Detail label="Category" value={categoryName} />
          <Detail label="Quantity" value={String(selectedProduct.quantity)} />
          <Detail label="Unit Price" value={`₹${selectedProduct.unitPrice}`} />
          <Detail label="Supplier" value={selectedProduct.supplierName} />
          <Detail label="Low Stock Threshold" value={String(selectedProduct.lowStockThreshold)} />
          <Detail label="Last Updated" value={new Date(selectedProduct.updatedAt).toLocaleDateString()} />
        </div>

        {selectedProduct.description && (
          <div className="mb-8">
            <p className="text-sm font-medium text-slate-500 mb-1">Description</p>
            <p className="text-slate-700">{selectedProduct.description}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button onClick={() => setIsStockOpen(true)}
            className="px-5 py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 transition">
            Adjust Stock
          </button>
          <button onClick={() => setIsEditOpen(true)}
            className="px-5 py-2.5 rounded-lg font-medium text-slate-700 border border-slate-200 hover:bg-slate-50 transition">
            Edit
          </button>
          <button onClick={() => setIsDeleteOpen(true)}
            className="px-5 py-2.5 rounded-lg font-medium text-red-600 border border-red-200 hover:bg-red-50 transition">
            Delete
          </button>
        </div>
      </div>

      <Modal title="Edit Product" isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <ProductForm initialData={selectedProduct} onSubmit={handleUpdate} loading={editLoading} />
      </Modal>

      <StockAdjustModal
        isOpen={isStockOpen}
        onClose={() => setIsStockOpen(false)}
        productUuid={selectedProduct.uuid}
        currentQuantity={selectedProduct.quantity}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Product"
        message="This action cannot be undone. Are you sure?"
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
        loading={deleteLoading}
      />
    </DashboardLayout>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className="text-slate-800 font-medium">{value}</p>
    </div>
  );
}