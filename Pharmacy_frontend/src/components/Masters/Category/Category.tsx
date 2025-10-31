import React from 'react';

import styles from './Category.css';

export interface CategoryProps {
  prop?: string;
}

export function Category({prop = 'default value'}: CategoryProps) {
  return <div className={styles.Category}>Category {prop}</div>;
}
