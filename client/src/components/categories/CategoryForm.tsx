'use client';

import { useState, FormEvent, useEffect } from 'react';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { Category, CategoryPayload } from '@/src/types/category.types';

interface CategoryFormProps {
  initialData?: Category | null;
  onSubmit: (payload: CategoryPayload) => Promise<void>;
  loading: boolean;
}

export function CategoryForm({ initialData, onSubmit, loading }: CategoryFormProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { setName(initialData?.name ?? ''); }, [initialData]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError('Category name is required');
    setError('');
    await onSubmit({ name: name.trim() });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input label="Category Name" value={name} onChange={(e) => setName(e.target.value)} error={error} />
      <Button type="submit" loading={loading}>{initialData ? 'Update' : 'Create'} Category</Button>
    </form>
  );
}