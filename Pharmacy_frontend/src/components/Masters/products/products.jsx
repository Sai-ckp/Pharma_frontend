import React from 'react';

import styles from './products.css';

export interface productsProps {
  prop?: string;
}

export function products({prop = 'default value'}: productsProps) {
  return <div className={styles.products}>products {prop}</div>;
}
