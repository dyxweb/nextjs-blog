/**
 * 文章详情
 */
'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NavBar } from 'antd-mobile';
import { UnorderedListOutline } from 'antd-mobile-icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'github-markdown-css';
import Layer from '@/components/layer';
import NavList from '@/components/navList';
import styleConfig from '@/styles/common.module.scss';
import styles from './index.module.scss';

interface BlogDetailProps {
  dir: string;
  file: string;
  fileContent: string;
}
const BlogDetail = (props: BlogDetailProps) => {
  const { file, fileContent } = props;
  const [navVisible, setNavVisible] = useState(false); // 目录导航的显示
  const router = useRouter()

  return (
    <Layer className={styles.blogDetail}>
      <NavBar
        onBack={() => router.back()}
        right={
          <UnorderedListOutline
            style={{ fontSize: 24 }}
            onClick={() => setNavVisible(true)}
          />
        }
        style={{
          '--border-bottom': `1px ${styleConfig.backColor} solid`
        }}
      >
        {file}
      </NavBar>
      <div className={styles.content}>
        <ReactMarkdown
          // 类名必须有
          className="markdown-body"
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            code(props: any) {
              const { children, ...rest } = props;
              return (
                <SyntaxHighlighter
                  {...rest}
                  style={vscDarkPlus}
                  PreTag="div"
                  language="javascript"
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              );
            }
          }}
        >
          {fileContent}
        </ReactMarkdown>
      </div>
      <NavList onClose={() => setNavVisible(false)} visible={navVisible} />
    </Layer>
  );
};
export default BlogDetail;
