import React from 'react';

import styles from './user.css';

export interface userProps {
  prop?: string;
}

export function user({prop = 'default value'}: userProps) {
  return <div className={styles.user}>user {prop}</div>;
}
