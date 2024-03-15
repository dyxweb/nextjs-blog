import BlogList from '@/ui/blogList';
import { getFileCatalog } from '@/lib/blog';

export default async function Interview() {
  const catalogData = await getFileCatalog('public/md/interview');

  return (
    <BlogList catalogData={catalogData} dirKey="interview" />
  );
}
 
