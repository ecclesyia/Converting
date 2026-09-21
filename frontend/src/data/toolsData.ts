import type { ToolItem } from '../types/tool';

export const TOOLS: ToolItem[] = [
  // --- Convert from PDF ---
  {
    id: 'pdf-to-word',
    title: 'PDF to Word',
    desc: 'Easily convert your PDF files into editable DOCX Word documents with intact styling and layout.',
    category: 'from_pdf',
    inputExt: '.pdf',
    outputExt: '.docx',
    badge: 'Popular',
    color: 'blue',
    iconName: 'FileText',
    endpoint: '/api/convert/pdf-to-word'
  },
  {
    id: 'pdf-to-excel',
    title: 'PDF to Excel',
    desc: 'Extract data tables from PDF files directly into clean XLSX Excel spreadsheets.',
    category: 'from_pdf',
    inputExt: '.pdf',
    outputExt: '.xlsx',
    badge: 'Accurate',
    color: 'green',
    iconName: 'Table',
    endpoint: '/api/convert/pdf-to-excel'
  },
  {
    id: 'pdf-to-powerpoint',
    title: 'PDF to PowerPoint',
    desc: 'Turn your PDF pages into editable PowerPoint PPTX presentation slide decks.',
    category: 'from_pdf',
    inputExt: '.pdf',
    outputExt: '.pptx',
    badge: 'Slides',
    color: 'orange',
    iconName: 'Presentation',
    endpoint: '/api/convert/pdf-to-powerpoint'
  },
  {
    id: 'pdf-to-images',
    title: 'PDF to JPG / PNG',
    desc: 'Extract high-resolution images from every single page of your PDF file.',
    category: 'from_pdf',
    inputExt: '.pdf',
    outputExt: '.zip',
    badge: 'High Res',
    color: 'yellow',
    iconName: 'Image',
    endpoint: '/api/convert/pdf-to-images'
  },
  {
    id: 'pdf-to-text',
    title: 'PDF to Text',
    desc: 'Extract all plain text characters and paragraphs from your PDF document.',
    category: 'from_pdf',
    inputExt: '.pdf',
    outputExt: '.txt',
    badge: 'Fast',
    color: 'slate',
    iconName: 'AlignLeft',
    endpoint: '/api/convert/pdf-to-text'
  },
  {
    id: 'extract-images',
    title: 'Extract Images from PDF',
    desc: 'Extract and download all embedded photographs, diagrams, and graphic assets in a zip file.',
    category: 'from_pdf',
    inputExt: '.pdf',
    outputExt: '.zip',
    badge: 'Assets',
    color: 'purple',
    iconName: 'Layers',
    endpoint: '/api/tools/extract-images'
  },

  // --- Convert to PDF ---
  {
    id: 'word-to-pdf',
    title: 'Word to PDF',
    desc: 'Make DOCX and DOC documents easy to view, print, and share by converting them to PDF format.',
    category: 'to_pdf',
    inputExt: '.docx,.doc',
    outputExt: '.pdf',
    badge: 'Popular',
    color: 'blue',
    iconName: 'FileText',
    endpoint: '/api/convert/word-to-pdf'
  },
  {
    id: 'excel-to-pdf',
    title: 'Excel to PDF',
    desc: 'Convert spreadsheets from XLSX and XLS into formatted, readable PDF pages.',
    category: 'to_pdf',
    inputExt: '.xlsx,.xls',
    outputExt: '.pdf',
    badge: 'Tables',
    color: 'green',
    iconName: 'Sheet',
    endpoint: '/api/convert/excel-to-pdf'
  },
  {
    id: 'powerpoint-to-pdf',
    title: 'PowerPoint to PDF',
    desc: 'Convert PPTX and PPT presentations into standard PDF files for hassle-free presentation sharing.',
    category: 'to_pdf',
    inputExt: '.pptx,.ppt',
    outputExt: '.pdf',
    badge: 'Decks',
    color: 'orange',
    iconName: 'Presentation',
    endpoint: '/api/convert/powerpoint-to-pdf'
  },
  {
    id: 'images-to-pdf',
    title: 'Images to PDF',
    desc: 'Combine and convert JPG, PNG, WEBP, or BMP images into a single professional PDF document.',
    category: 'to_pdf',
    inputExt: '.jpg,.jpeg,.png,.webp,.bmp',
    outputExt: '.pdf',
    badge: 'Multi-image',
    color: 'emerald',
    iconName: 'Images',
    endpoint: '/api/convert/images-to-pdf',
    acceptMultiple: true
  },
  {
    id: 'text-to-pdf',
    title: 'Text to PDF',
    desc: 'Convert plain text or Markdown files into nicely formatted PDF documents.',
    category: 'to_pdf',
    inputExt: '.txt,.md',
    outputExt: '.pdf',
    badge: 'Doc',
    color: 'slate',
    iconName: 'FileCode',
    endpoint: '/api/convert/text-to-pdf'
  },

  // --- PDF Organize & Edit ---
  {
    id: 'merge-pdf',
    title: 'Merge PDF',
    desc: 'Combine multiple PDF files in your preferred sequence into one unified document.',
    category: 'organize',
    inputExt: '.pdf',
    outputExt: '.pdf',
    badge: 'Essential',
    color: 'red',
    iconName: 'Combine',
    endpoint: '/api/tools/merge',
    acceptMultiple: true
  },
  {
    id: 'split-pdf',
    title: 'Split PDF',
    desc: 'Extract individual pages or specified page ranges into separate PDF documents.',
    category: 'organize',
    inputExt: '.pdf',
    outputExt: '.zip',
    badge: 'Pages',
    color: 'red',
    iconName: 'Scissors',
    endpoint: '/api/tools/split'
  },
  {
    id: 'compress-pdf',
    title: 'Compress PDF',
    desc: 'Reduce file size while retaining optimal document visual quality and clarity.',
    category: 'organize',
    inputExt: '.pdf',
    outputExt: '.pdf',
    badge: 'Save MBs',
    color: 'red',
    iconName: 'Minimize2',
    endpoint: '/api/tools/compress'
  },
  {
    id: 'rotate-pdf',
    title: 'Rotate PDF',
    desc: 'Rotate PDF pages clockwise by 90, 180, or 270 degrees in seconds.',
    category: 'organize',
    inputExt: '.pdf',
    outputExt: '.pdf',
    badge: 'Orient',
    color: 'teal',
    iconName: 'RotateCw',
    endpoint: '/api/tools/rotate'
  },
  {
    id: 'watermark-pdf',
    title: 'Watermark PDF',
    desc: 'Stamp customized text watermarks (e.g. Confidential, Draft, or your company name) across pages.',
    category: 'organize',
    inputExt: '.pdf',
    outputExt: '.pdf',
    badge: 'Custom',
    color: 'indigo',
    iconName: 'Stamp',
    endpoint: '/api/tools/watermark'
  },

  // --- PDF Security ---
  {
    id: 'protect-pdf',
    title: 'Protect PDF',
    desc: 'Encrypt your PDF with strong AES passwords to prevent unauthorized access and printing.',
    category: 'security',
    inputExt: '.pdf',
    outputExt: '.pdf',
    badge: 'Security',
    color: 'violet',
    iconName: 'Lock',
    endpoint: '/api/tools/protect'
  },
  {
    id: 'unlock-pdf',
    title: 'Unlock PDF',
    desc: 'Remove password security from your encrypted PDF to freely read, print, and distribute.',
    category: 'security',
    inputExt: '.pdf',
    outputExt: '.pdf',
    badge: 'Decrypt',
    color: 'violet',
    iconName: 'Unlock',
    endpoint: '/api/tools/unlock'
  }
];
