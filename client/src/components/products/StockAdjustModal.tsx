'use client';

import { useState } from 'react';
import { Modal } from '@/src/components/ui/Modal';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { useAppDispatch } from '@/src/redux/hooks';
import { increaseStock, reduceStock } from '@/src/thunks/product.thunks';
import toast from 'react-hot-toast';

interface StockAdjustModalProps {
  isOpen: boolean;
  onClose: () => void;
  productUuid: string;
  currentQuantity: number;
}

export function StockAdjustModal({ isOpen, onClose, productUuid, currentQuantity }: StockAdjustModalProps) {
  const dispatch = useAppDispatch();
  const [amount, setAmount] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleAdjust = async (type: 'increase' | 'reduce') => {
    if (amount <= 0) return toast.error('Enter an amount greater than 0');
    if (type === 'reduce' && amount > currentQuantity) {
      return toast.error('Cannot reduce below zero');
    }

    setLoading(true);
    const action = type === 'increase' ? increaseStock : reduceStock;
    const result = await dispatch(action({ uuid: productUuid, amount }));
    setLoading(false);

    if (action.fulfilled.match(result)) {
      toast.success(`Stock ${type === 'increase' ? 'increased' : 'reduced'} successfully`);
      onClose();
    } else {
      toast.error((result.payload as string) || 'Failed to adjust stock');
    }
  };

  return (
    <Modal title="Adjust Stock" isOpen={isOpen} onClose={onClose}>
      <p className="text-sm text-slate-500 mb-4">Current quantity: <span className="font-medium text-slate-700">{currentQuantity}</span></p>
      <Input label="Amount" type="number" min={1} value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
      <div className="flex gap-3 mt-2">
        <button
          onClick={() => handleAdjust('increase')}
          disabled={loading}
          className="flex-1 py-2.5 rounded-lg font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition disabled:opacity-60"
        >
          + Increase
        </button>
        <button
          onClick={() => handleAdjust('reduce')}
          disabled={loading}
          className="flex-1 py-2.5 rounded-lg font-medium text-white bg-red-500 hover:bg-red-600 transition disabled:opacity-60"
        >
          − Reduce
        </button>
      </div>
    </Modal>
  );
}