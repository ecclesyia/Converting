import os
import zipfile
import fitz  # PyMuPDF

# Ensure backwards compatibility for pdf2docx with newer PyMuPDF versions
if not hasattr(fitz.Rect, 'get_area'):
    fitz.Rect.get_area = lambda self: abs(self.width * self.height)

import openpyxl
from pdf2docx import Converter
from pptx import Presentation
from pptx.util import Inches
import io

def pdf_to_docx(pdf_path: str, docx_path: str):
    """Converts PDF to DOCX with layout, text, tables, and images preserved."""
    cv = Converter(pdf_path)
    cv.convert(docx_path, start=0, end=None)
    cv.close()
    return docx_path

def pdf_to_excel(pdf_path: str, xlsx_path: str):
    """Extracts tables and structured text from PDF pages and saves directly to Excel using openpyxl."""
    doc = fitz.open(pdf_path)
    wb = openpyxl.Workbook()
    wb.remove(wb.active)  # Remove default empty sheet

    has_content = False
    for page_num in range(len(doc)):
        page = doc[page_num]
        sheet_title = f"Page_{page_num+1}"[:31]
        ws = wb.create_sheet(title=sheet_title)

        try:
            tables = page.find_tables()
            if tables and tables.tables:
                for t_idx, tab in enumerate(tables):
                    extracted = tab.extract()
                    for r in extracted:
                        ws.append([str(c) if c is not None else "" for c in r])
                    ws.append([])
                has_content = True
                continue
        except Exception:
            pass

        text_blocks = page.get_text("blocks")
        if text_blocks:
            for b in text_blocks:
                content = b[4].strip()
                if content:
                    ws.append([content])
                    has_content = True

    if not has_content:
        ws = wb.create_sheet(title="Sheet1")
        ws.append(["No text or tables detected in document."])

    doc.close()
    wb.save(xlsx_path)
    return xlsx_path

def pdf_to_pptx(pdf_path: str, pptx_path: str):
    """Converts PDF pages into PowerPoint slides with high-fidelity rendered visual and text overlay."""
    prs = Presentation()
    prs.slide_width = Inches(10)
    prs.slide_height = Inches(7.5)
    blank_slide_layout = prs.slide_layouts[6]

    doc = fitz.open(pdf_path)
    for page in doc:
        slide = prs.slides.add_slide(blank_slide_layout)
        pix = page.get_pixmap(dpi=150)
        img_bytes = pix.tobytes("png")
        image_stream = io.BytesIO(img_bytes)

        page_w = page.rect.width
        page_h = page.rect.height
        aspect = page_w / page_h
        
        slide_w = 10.0
        slide_h = 7.5
        
        if aspect > (slide_w / slide_h):
            w_in = slide_w
            h_in = slide_w / aspect
            left_in = 0
            top_in = (slide_h - h_in) / 2
        else:
            h_in = slide_h
            w_in = slide_h * aspect
            top_in = 0
            left_in = (slide_w - w_in) / 2

        slide.shapes.add_picture(
            image_stream,
            Inches(left_in), Inches(top_in),
            width=Inches(w_in), height=Inches(h_in)
        )
    doc.close()
    prs.save(pptx_path)
    return pptx_path

def pdf_to_images(pdf_path: str, output_zip_path: str, fmt: str = "png", dpi: int = 150):
    """Converts all pages of a PDF to high-resolution images and packages them in a ZIP archive."""
    doc = fitz.open(pdf_path)
    with zipfile.ZipFile(output_zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        for i, page in enumerate(doc):
            pix = page.get_pixmap(dpi=dpi)
            img_bytes = pix.tobytes(fmt)
            filename = f"page_{i+1:03d}.{fmt}"
            zf.writestr(filename, img_bytes)
    doc.close()
    return output_zip_path

def pdf_to_text(pdf_path: str, txt_path: str):
    """Extracts plain text from all pages in a PDF document."""
    doc = fitz.open(pdf_path)
    full_text = []
    for i, page in enumerate(doc):
        full_text.append(f"--- Page {i+1} ---\n")
        full_text.append(page.get_text())
        full_text.append("\n\n")
    doc.close()
    with open(txt_path, 'w', encoding='utf-8') as f:
        f.writelines(full_text)
    return txt_path

def extract_images_from_pdf(pdf_path: str, output_zip_path: str):
    """Extracts all embedded raw image assets inside a PDF and zips them."""
    doc = fitz.open(pdf_path)
    with zipfile.ZipFile(output_zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        for page_idx, page in enumerate(doc):
            for img_idx, img in enumerate(page.get_images(full=True)):
                xref = img[0]
                base_img = doc.extract_image(xref)
                image_bytes = base_img["image"]
                image_ext = base_img["ext"]
                filename = f"image_p{page_idx+1}_{img_idx+1}.{image_ext}"
                zf.writestr(filename, image_bytes)
    doc.close()
    return output_zip_path
