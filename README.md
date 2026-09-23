# OmniPDF Studio

A fast, clean, self-hosted web application for converting, organizing, and securing PDF and office documents. Inspired by tools like **iLovePDF**, OmniPDF processes documents directly on your local system with complete privacy, zero file size caps, and no cloud dependencies.

---

## ⚡ Key Features

### 1. Convert From PDF
- **PDF to Word (`.docx`)**: Converts PDF files into fully editable Word documents preserving typography, columns, and tables.
- **PDF to Excel (`.xlsx`)**: Extracts structured tabular data from PDF pages into spreadsheets.
- **PDF to PowerPoint (`.pptx`)**: Generates slide decks from PDF pages.
- **PDF to Images (PNG / JPG)**: Exports all pages as high-resolution images in a ZIP archive.
- **PDF to Text (`.txt`)**: Extracts raw text and structure.
- **Extract Embedded Assets**: Zips all raw image and graphic assets embedded inside a PDF.

### 2. Convert To PDF
- **Word to PDF (`.docx`, `.doc` → `.pdf`)**: Converts documents into standard PDF pages.
- **Excel to PDF (`.xlsx`, `.xls` → `.pdf`)**: Formats sheets and data tables into PDF pages.
- **PowerPoint to PDF (`.pptx`, `.ppt` → `.pdf`)**: Exports presentation slide decks to PDF.
- **Images to PDF (`.png`, `.jpg`, `.webp`, `.bmp` → `.pdf`)**: Combines multiple images into a unified multi-page PDF.
- **Text & Markdown to PDF (`.txt`, `.md` → `.pdf`)**: Formats text documents into clean PDF files.

### 3. PDF Utilities & Security
- **Merge PDF**: Combine multiple PDF files with custom order and drag-and-drop support.
- **Split PDF**: Split documents page-by-page or by custom page ranges (e.g. `1-3, 5, 7-10`).
- **Compress PDF**: Optimize streams and downsample imagery (Balanced vs High compression).
- **Watermark PDF**: Stamp custom text watermarks with control over font size, rotation angle (0°, 45°, 90°), opacity, and color.
- **Password Protect**: Encrypt PDFs with AES 128/256-bit passwords.
- **Unlock PDF**: Decrypt password-protected files.
- **Rotate PDF**: Rotate pages clockwise by 90°, 180°, or 270°.

---

## 🚀 Quick Start

### Prerequisites
- **Python 3.9+**
- **Node.js 18+** (only needed if developing the frontend; pre-built production build is included)

### 1-Click Launch (Windows)
Double-click [`run.bat`](./run.bat) in the project root:
```cmd
run.bat
```
This automatically boots the backend and opens [http://127.0.0.1:8000](http://127.0.0.1:8000) in your browser.

---

### Manual Launch

#### 1. Backend Server
```bash
cd backend
python -m pip install -r requirements.txt
python main.py
```
Backend runs on: `http://127.0.0.1:8000`  
Interactive Swagger API docs: `http://127.0.0.1:8000/docs`

#### 2. Frontend Development (Optional)
If you want to run Vite live development:
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: `http://127.0.0.1:5173` (proxies `/api` requests to backend).

---

## 🏗️ Architecture

```
omnipdf/
├── backend/
│   ├── converters/
│   │   ├── pdf_to_office.py      # PDF -> DOCX, XLSX, PPTX, Images, Text
│   │   ├── office_to_pdf.py      # DOCX, XLSX, PPTX, Images, Text -> PDF
│   │   └── pdf_ops.py            # Merge, Split, Compress, Watermark, Protect, Rotate
│   ├── main.py                   # FastAPI application & static file router
│   ├── requirements.txt          # Python dependencies (PyMuPDF, pdf2docx, etc.)
│   └── test_converters.py        # Automated test suite
├── frontend/
│   ├── src/
│   │   ├── components/           # UI Components (Header, Hero, ToolGrid, ToolModal, Footer)
│   │   ├── data/toolsData.ts     # Tool catalog & configuration
│   │   ├── types/                # TypeScript type definitions
│   │   └── App.tsx               # Main application component
│   ├── package.json
│   ├── vite.config.ts
│   └── dist/                     # Production static build served by FastAPI
├── run.bat                       # 1-click Windows launcher
└── README.md
```

---

## 🔒 Privacy & Local Processing

- **100% Offline & Local**: All file processing happens entirely on your machine.
- **Automatic Cleanup**: Uploaded and generated files are stored in temporary memory/disk locations and purged automatically after download.
- **Zero Tracking**: No telemetry, accounts, or third-party cookies.

---

## 🧪 Testing

Run the automated conversion test suite:
```bash
cd backend
python test_converters.py
```
This verifies all 13 conversion and manipulation routines against generated test assets.

---

## 📄 License
MIT License. Free for personal and commercial use.
