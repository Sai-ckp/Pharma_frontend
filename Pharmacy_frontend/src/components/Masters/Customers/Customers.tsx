import React from 'react';

import styles from './Customers.css';

export interface CustomersProps {
  prop?: string;
}

export function Customers({prop = 'default value'}: CustomersProps) {
  return <div className={styles.Customers}>Customers {prop}</div>;
}
