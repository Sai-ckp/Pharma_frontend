import React from 'react';

import styles from './Masters.css';

export interface MastersProps {
  prop?: string;
}

export function Masters({prop = 'default value'}: MastersProps) {
  return <div className={styles.Masters}>Masters {prop}</div>;
}
