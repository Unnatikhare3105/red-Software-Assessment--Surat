import { ProductStatus } from '@/src/types/product.types';

const STYLES: Record<ProductStatus, string> = {
  in_stock: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  low_stock: 'bg-amber-50 text-amber-700 border-amber-200',
  out_of_stock: 'bg-red-50 text-red-700 border-red-200',
};

const LABELS: Record<ProductStatus, string> = {
  in_stock: 'In Stock',
  low_stock: 'Low Stock',
  out_of_stock: 'Out of Stock',
};

export function StatusBadge({ status }: { status: ProductStatus }) {
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${STYLES[status]}`}>
      {LABELS[status]}
    </span>
  );
}