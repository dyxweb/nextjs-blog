/**
 * 浮层组件(用于新的路由组件覆盖之前的路由组件)
 */
import React, { ReactNode } from 'react';
import styles from './index.module.scss';

interface LayerProps {
  children: ReactNode;
  className?: string;
}
const Layer = (props: LayerProps) => {
  const { children, className } = props;

  return (
    <div className={className ? `${className} ${styles.layer}` : styles.layer}>
      {children}
    </div>
  );
};
export default Layer;
