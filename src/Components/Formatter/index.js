import React from 'react';
import ReactCurrencyFormatter from 'react-currency-formatter';

export default function Currency({currency, pattern, ...remainingProps}) {
  return (
    <ReactCurrencyFormatter
      currency={currency || 'MNT'}
      pattern={pattern || '#,##0.!'}
      {...remainingProps}
    />
  );
}
