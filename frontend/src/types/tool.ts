export type ToolCategory = 'all' | 'from_pdf' | 'to_pdf' | 'organize' | 'security';

export interface ToolItem {
  id: string;
  title: string;
  desc: string;
  category: ToolCategory;
  inputExt: string;
  outputExt: string;
  badge?: string;
  color: 'red' | 'blue' | 'green' | 'orange' | 'yellow' | 'purple' | 'emerald' | 'indigo' | 'violet' | 'teal' | 'slate';
  iconName: string;
  endpoint: string;
  acceptMultiple?: boolean;
}
