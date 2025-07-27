interface CharacterCounterProps {
  count: number;
}

export function CharacterCounter({ count }: CharacterCounterProps) {
  const getColorClasses = () => {
    if (count <= 20000) {
      return {
        text: 'text-green-600',
        dot: 'bg-green-500'
      };
    } else if (count <= 40000) {
      return {
        text: 'text-yellow-600',
        dot: 'bg-yellow-500'
      };
    } else {
      return {
        text: 'text-red-600',
        dot: 'bg-red-500'
      };
    }
  };

  const { text, dot } = getColorClasses();
  const formattedCount = count.toLocaleString();

  return (
    <div className={`flex items-center gap-2 text-sm ${text}`}>
      <div className={`w-2 h-2 rounded-full ${dot}`}></div>
      <span>{formattedCount} characters</span>
    </div>
  );
}