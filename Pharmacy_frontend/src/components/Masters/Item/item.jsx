import React from 'react';

import styles from './item.css';

export interface itemProps {
  prop?: string;
}

export function item({prop = 'default value'}: itemProps) {
  return <div className={styles.item}>item {prop}</div>;
}
