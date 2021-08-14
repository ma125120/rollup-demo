import React, { FC } from 'react';

export const Button: FC<{ text: string }> = ({ text }) => {
  return (
    <button type="button" className="das btn">
      {text}
    </button>
  );
};
