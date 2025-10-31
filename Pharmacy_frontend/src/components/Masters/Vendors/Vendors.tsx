import React from 'react';

import styles from './Vendors.css';

export interface VendorsProps {
  prop?: string;
}

export function Vendors({prop = 'default value'}: VendorsProps) {
  return <div className={styles.Vendors}>Vendors {prop}</div>;
}
