'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { DashboardLayout } from '@/src/components/layout/DashboardLayout';
import { Spinner } from '@/src/components/ui/Spinner';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { Modal } from '@/src/components/ui/Modal';
import { ConfirmDialog } from '@/src/components/ui/ConfirmDialog';
import { CategoryForm } from '@/src/components/categories/CategoryForm';
import { useAppDispatch, useAppSelector } from '@/src/redux/hooks';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '@/src/thunks/category.thunks';
import { Category, CategoryPayload } from '@/src/types/category.types';

export default function CategoriesPage() {
  const dispatch = useAppDispatch();
  const { categories, loading } = useAppSelector((state) => state.category);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => { dispatch(fetchCategories()); }, [dispatch]);

  const handleSubmit = async (payload: CategoryPayload) => {
    setFormLoading(true);
    const action = editTarget
      ? await dispatch(updateCategory({ uuid: editTarget.uuid, payload }))
      : await dispatch(createCategory(payload));
    setFormLoading(false);

    if (action.meta.requestStatus === 'fulfilled') {
      toast.success(editTarget ? 'Category updated' : 'Category created');
      setIsFormOpen(false);
      setEditTarget(null);
    } else {
      toast.error((action.payload as string) || 'Something went wrong');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    const result = await dispatch(deleteCategory(deleteTarget));
    setDeleteLoading(false);
    setDeleteTarget(null);
    if (deleteCategory.fulfilled.match(result)) {
      toast.success('Category deleted, products unassigned');
    } else {
      toast.error((result.payload as string) || 'Failed to delete category');
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Categories</h1>
        <button
          onClick={() => { setEditTarget(null); setIsFormOpen(true); }}
          className="px-5 py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 transition shadow-md shadow-indigo-200"
        >
          + Add Category
        </button>
      </div>

     <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
        {loading ? (
          <Spinner />
        ) : categories.length === 0 ? (
          <EmptyState title="No categories yet" subtitle="Create one to start organizing products" />
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((c) => (
                <tr key={c.uuid} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-3 text-slate-800 font-medium">{c.name}</td>
                  <td className="px-6 py-3 text-right space-x-3">
                    <button onClick={() => { setEditTarget(c); setIsFormOpen(true); }} className="text-indigo-600 hover:underline">Edit</button>
                    <button onClick={() => setDeleteTarget(c.uuid)} className="text-red-500 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal title={editTarget ? 'Edit Category' : 'Add Category'} isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditTarget(null); }}>
        <CategoryForm initialData={editTarget} onSubmit={handleSubmit} loading={formLoading} />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Category"
        message="Products in this category will become uncategorized. Continue?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteLoading}
      />
    </DashboardLayout>
  );
}