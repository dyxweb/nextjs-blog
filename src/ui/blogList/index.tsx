/**
 * blog文件列表
 */
'use client'
import { useRouter } from 'next/navigation';
import { Collapse, List } from 'antd-mobile';

interface MenuItem {
  key: string;
  title: string;
}
interface MenuConfig extends MenuItem {
  children: MenuItem[];
}
interface BlogListProps {
  catalogData: MenuConfig[];
  dirKey: string;
}
const BlogList = (props: BlogListProps) => {
  const { catalogData, dirKey } = props;
  const router = useRouter();

  return (
    <Collapse accordion>
      {catalogData.map((dir: MenuConfig) => {
        const { key, title, children = [] } = dir;
        if (children.length) {
          return (
            <Collapse.Panel key={key} title={title}>
              {children.map((file: MenuItem) => (
                <List.Item key={file.key} onClick={() => router.push(`/blog/${dirKey}/${title}/${file.title}`)}>
                  <div>
                    {file.title}
                  </div>
                </List.Item>
              ))}
            </Collapse.Panel>
          );
        }
      })}
    </Collapse>
  )
}

export default BlogList;