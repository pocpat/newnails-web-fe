import React from 'react';

interface GlassButtonProps {
  onPress: () => void;
  title: string;
  disabled?: boolean;
  loading?: boolean;
}

const GlassButton: React.FC<GlassButtonProps> = ({ onPress, title, disabled, loading }) => {
  return (
    <button
      onClick={onPress}
      disabled={disabled || loading}
      className={`
        relative
        rounded-full
        overflow-hidden
        self-center
        mt-8
        w-50 h-12
        flex items-center justify-center
        border border-white/30
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%)',
      }}
    >
      {loading ? (
        <div className="loader">Loading...</div> // Placeholder for a loader component
      ) : (
        <span className="text-lg font-bold text-indigo">{title}</span>
      )}
    </button>
  );
};

export default GlassButton;
