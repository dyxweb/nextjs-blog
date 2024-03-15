import BlogList from '@/ui/blogList';
import { getFileCatalog } from '@/lib/blog';

export default async function My() {
  const catalogData = await getFileCatalog('public/md/gwy');

  return (
    <BlogList catalogData={catalogData} dirKey="my" />
  );
}
