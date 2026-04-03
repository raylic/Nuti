import React from 'react';

type TitleProps = {
  title: React.ReactNode;
  subTitle?: React.ReactNode;
  className?: string;
};

export default function Title({ title, subTitle, className = '' }: TitleProps) {
  return (
    <div className={`flex flex-col align-center justify-center mx-auto h-full bg-[var(--accent-a3)] rounded-lg shadow-md ${className}`}>
      <h3 className="text-3xl font-bold text-[var(--accent-indicator)] text-center">{title}</h3>
      <p className="mt-1 text-[var(--accent-indicator)] text-sm text-center">{subTitle}</p>
    </div>
  );
}
