import BlogList from '@/components/blogList';
import { getFileData } from '@/lib/getFileData';

export default async function My() {
  const fileData = await getFileData('public/md/gwy');

  return (
    <BlogList fileData={fileData} />
  );
}
