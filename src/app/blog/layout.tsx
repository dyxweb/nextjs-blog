/**
 * layout
 */
'use client'
import { usePathname, useRouter } from 'next/navigation';
import { TabBar } from 'antd-mobile';
import { AppOutline, UserOutline } from 'antd-mobile-icons';
import styles from './layout.module.scss';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();

  // 点击切换路由
  const onTabBarChange = (key: string) => {
    router.replace(key);
  };

  const tabs = [
    {
      key: '/blog/interview',
      title: '首页',
      icon: <AppOutline />
    },
    {
      key: '/blog/my',
      title: '我的',
      icon: <UserOutline />
    }
  ];
  return (
    <div className={styles.layout}>
      <div className={styles.content}>{children}</div>
      <div className={styles.tabBar}>
        <TabBar onChange={onTabBarChange} activeKey={pathname}>
          {tabs.map(item => (
            <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
          ))}
        </TabBar>
      </div>
    </div>
  );
};

export default Layout;
