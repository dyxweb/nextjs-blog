import BlogDetail from '@/ui/blogDetail';
import { getFileContent } from '@/lib/blog';

export default async function MyDetail({ params }: { params: { dir: string, file: string }}) {
  const { dir, file } = params;
  const decodeDir = decodeURI(dir);
  const decodeFile = decodeURI(file);
  const fileContent = await getFileContent(`public/md/gwy/${decodeDir}/${decodeFile}.md`);

  return (
    <BlogDetail dir={decodeDir} file={decodeFile} fileContent={fileContent} />
  );
};

