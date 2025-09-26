export interface CmsPage {
  id: string;
  slug: string;
  content: string;
  title: string;
}

export interface CmsPageData {
  page: CmsPage;
}