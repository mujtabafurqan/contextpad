import { X } from 'lucide-react';

interface ClearButtonProps {
  onClear: () => void;
  disabled?: boolean;
}

export function ClearButton({ onClear, disabled = false }: ClearButtonProps) {
  return (
    <button
      onClick={onClear}
      disabled={disabled}
      className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      title="Clear content"
    >
      <X size={16} />
    </button>
  );
}