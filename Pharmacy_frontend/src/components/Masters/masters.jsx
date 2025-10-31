import React from 'react';

import styles from './masters.css';

export interface mastersProps {
  prop?: string;
}

export function masters({prop = 'default value'}: mastersProps) {
  return <div className={styles.masters}>masters {prop}</div>;
}
