'use client';

import { useState, FormEvent, useEffect } from 'react';
import { Input } from '@/src/components/ui/Input';
import { Select } from '@/src/components/ui/Select';
import { Textarea } from '@/src/components/ui/Textarea';
import { Button } from '@/src/components/ui/Button';
import { useAppSelector } from '@/src/redux/hooks';
import { Product, ProductPayload } from '@/src/types/product.types';

interface ProductFormProps {
  initialData?: Product | null;
  onSubmit: (payload: ProductPayload) => Promise<void>;
  loading: boolean;
}

const emptyForm: ProductPayload = {
  name: '', sku: '', categoryId: '', description: '', quantity: 0, unitPrice: 0,
  supplierName: '', lowStockThreshold: 10,
};

export function ProductForm({ initialData, onSubmit, loading }: ProductFormProps) {
  const { categories } = useAppSelector((state) => state.category);
  const [form, setForm] = useState<ProductPayload>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        sku: initialData.sku,
        categoryId: initialData.categoryId ?? '',
        description: initialData.description ?? '',
        quantity: initialData.quantity,
        unitPrice: initialData.unitPrice,
        supplierName: initialData.supplierName,
        lowStockThreshold: initialData.lowStockThreshold,
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Product name is required';
    if (!form.sku.trim()) newErrors.sku = 'SKU is required';
    if (!form.supplierName.trim()) newErrors.supplierName = 'Supplier name is required';
    if (form.quantity < 0) newErrors.quantity = 'Quantity cannot be negative';
    if (form.unitPrice < 0) newErrors.unitPrice = 'Price cannot be negative';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({ ...form, categoryId: form.categoryId || null } as ProductPayload);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input label="Product Name" value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
      <Input label="SKU" value={form.sku}
        onChange={(e) => setForm({ ...form, sku: e.target.value })} error={errors.sku} />
      <Select
        label="Category" value={form.categoryId ?? ''}
        onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
        options={[{ value: '', label: 'No category' }, ...categories.map((c) => ({ value: c.uuid, label: c.name }))]}
      />
      <Textarea label="Description" value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Quantity" type="number" value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} error={errors.quantity} />
        <Input label="Unit Price" type="number" step="0.01" value={form.unitPrice}
          onChange={(e) => setForm({ ...form, unitPrice: Number(e.target.value) })} error={errors.unitPrice} />
      </div>
      <Input label="Supplier Name" value={form.supplierName}
        onChange={(e) => setForm({ ...form, supplierName: e.target.value })} error={errors.supplierName} />
      <Input label="Low Stock Threshold" type="number" value={form.lowStockThreshold}
        onChange={(e) => setForm({ ...form, lowStockThreshold: Number(e.target.value) })} />
      <Button type="submit" loading={loading}>{initialData ? 'Update' : 'Add'} Product</Button>
    </form>
  );
}