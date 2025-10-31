import React from 'react';

import styles from './Item.css';

export interface ItemProps {
  prop?: string;
}

export function Item({prop = 'default value'}: ItemProps) {
  return <div className={styles.Item}>Item {prop}</div>;
}
