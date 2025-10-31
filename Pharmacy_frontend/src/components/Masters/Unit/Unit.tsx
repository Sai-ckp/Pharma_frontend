import React from 'react';

import styles from './Unit.css';

export interface UnitProps {
  prop?: string;
}

export function Unit({prop = 'default value'}: UnitProps) {
  return <div className={styles.Unit}>Unit {prop}</div>;
}
