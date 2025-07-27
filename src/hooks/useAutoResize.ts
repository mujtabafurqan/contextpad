import { useCallback, useEffect, useRef } from 'react';

interface UseAutoResizeOptions {
  minHeight?: number;
  maxHeight?: number;
}

export function useAutoResize(options: UseAutoResizeOptions = {}) {
  const { minHeight = 100, maxHeight = 600 } = options;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to get accurate scrollHeight
    textarea.style.height = 'auto';
    
    // Calculate new height
    const scrollHeight = textarea.scrollHeight;
    const newHeight = Math.max(minHeight, Math.min(maxHeight, scrollHeight));
    
    // Set the new height
    textarea.style.height = `${newHeight}px`;
  }, [minHeight, maxHeight]);

  // Adjust height when content changes
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    adjustHeight();
    return e;
  }, [adjustHeight]);

  // Adjust height on mount and when dependencies change
  useEffect(() => {
    adjustHeight();
  }, [adjustHeight]);

  return {
    textareaRef,
    handleChange,
    adjustHeight
  };
}