import BlogList from '@/components/blogList';
import { getFileData } from '@/lib/getFileData';

export default async function Interview() {
  const fileData = await getFileData('public/md/interview');

  return (
    <BlogList fileData={fileData} />
  );
}
 
