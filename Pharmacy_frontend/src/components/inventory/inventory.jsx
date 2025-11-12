import React from 'react';

import styles from './inventory.css';

export interface inventoryProps {
  prop?: string;
}

export function inventory({prop = 'default value'}: inventoryProps) {
  return <div className={styles.inventory}>inventory {prop}</div>;
}
