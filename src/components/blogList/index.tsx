'use client'
import { Collapse, List } from 'antd-mobile';

interface MenuItem {
  key: string;
  title: string;
}
interface MenuConfig extends MenuItem {
  children: MenuItem[];
}
interface BlogListProps {
  fileData: MenuConfig[];
}
const BlogList = (props: BlogListProps) => {
  const { fileData } = props;

  return (
    <Collapse accordion>
      {fileData.map((dir: MenuConfig) => {
        const { key, title, children = [] } = dir;
        if (children.length) {
          return (
            <Collapse.Panel key={key} title={title}>
              {children.map((file: MenuItem) => (
                <List.Item key={file.key}>
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