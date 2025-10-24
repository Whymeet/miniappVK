import React from 'react';

interface LogoProps {
  src: string;
  alt: string;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Универсальный компонент для отображения логотипов
 * Поддерживает как статичные изображения (PNG, JPG, WebP), так и анимированные (WebM, MP4)
 */
export default function Logo({ src, alt, style, className }: LogoProps) {
  // Определяем тип файла по расширению
  const isVideo = /\.(webm|mp4)$/i.test(src);

  if (isVideo) {
    return (
      <video
        src={src}
        title={alt}
        style={style}
        className={className}
        autoPlay
        loop
        muted
        playsInline
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      style={style}
      className={className}
    />
  );
}

