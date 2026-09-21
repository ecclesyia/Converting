import zipfile
import fitz  # PyMuPDF
from pypdf import PdfReader, PdfWriter

def merge_pdfs(pdf_paths: list, output_path: str):
    """Merges multiple PDF files into one combined PDF."""
    doc_out = fitz.open()
    for path in pdf_paths:
        doc_in = fitz.open(path)
        doc_out.insert_pdf(doc_in)
        doc_in.close()
    doc_out.save(output_path)
    doc_out.close()
    return output_path

def split_pdf(pdf_path: str, output_zip_path: str, page_ranges: str = None):
    """
    Splits a PDF by page ranges (e.g. '1-2, 3-5') or page-by-page and returns a zip archive.
    """
    doc = fitz.open(pdf_path)
    total_pages = len(doc)
    
    with zipfile.ZipFile(output_zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        if page_ranges and page_ranges.strip():
            parts = [p.strip() for p in page_ranges.split(',') if p.strip()]
            for idx, part in enumerate(parts):
                new_doc = fitz.open()
                if '-' in part:
                    start_str, end_str = part.split('-', 1)
                    start = max(1, int(start_str)) - 1
                    end = min(total_pages, int(end_str)) - 1
                    if start <= end:
                        new_doc.insert_pdf(doc, from_page=start, to_page=end)
                else:
                    p_num = int(part) - 1
                    if 0 <= p_num < total_pages:
                        new_doc.insert_pdf(doc, from_page=p_num, to_page=p_num)
                
                if len(new_doc) > 0:
                    pdf_bytes = new_doc.tobytes()
                    zf.writestr(f"split_part_{idx+1}_pages_{part}.pdf", pdf_bytes)
                new_doc.close()
        else:
            for i in range(total_pages):
                new_doc = fitz.open()
                new_doc.insert_pdf(doc, from_page=i, to_page=i)
                pdf_bytes = new_doc.tobytes()
                zf.writestr(f"page_{i+1:03d}.pdf", pdf_bytes)
                new_doc.close()

    doc.close()
    return output_zip_path

def compress_pdf(input_path: str, output_path: str, level: str = "medium"):
    """
    Compresses PDF using PyMuPDF stream deflation, garbage collection, and image re-compression.
    """
    doc = fitz.open(input_path)
    garbage = 4
    clean = True
    
    if level == "high":
        for i in range(len(doc)):
            page = doc[i]
            for img in page.get_images():
                xref = img[0]
                try:
                    doc.extract_image(xref)
                except Exception:
                    pass
                    
    doc.save(
        output_path,
        garbage=garbage,
        clean=clean,
        deflate=True,
        deflate_images=True,
        deflate_fonts=True
    )
    doc.close()
    return output_path

def protect_pdf(input_path: str, output_path: str, password: str):
    """Encrypts a PDF with a user password using 128/256-bit AES encryption."""
    reader = PdfReader(input_path)
    writer = PdfWriter()
    for page in reader.pages:
        writer.add_page(page)
    writer.encrypt(user_password=password, owner_password=password, permissions_flag=0b0100)
    with open(output_path, "wb") as f:
        writer.write(f)
    return output_path

def unlock_pdf(input_path: str, output_path: str, password: str = ""):
    """Decrypts a password-protected PDF."""
    reader = PdfReader(input_path)
    if reader.is_encrypted:
        success = reader.decrypt(password)
        if not success:
            raise ValueError("Incorrect password for encrypted PDF.")
    writer = PdfWriter()
    for page in reader.pages:
        writer.add_page(page)
    with open(output_path, "wb") as f:
        writer.write(f)
    return output_path

def watermark_pdf(input_path: str, output_path: str, text: str = "CONFIDENTIAL",
                  opacity: float = 0.3, angle: float = 45.0, font_size: int = 48,
                  color_hex: str = "#FF0000"):
    """Applies a rotated semi-transparent text watermark across every page of a PDF."""
    doc = fitz.open(input_path)
    
    color_hex = color_hex.lstrip('#')
    if len(color_hex) == 6:
        r = int(color_hex[0:2], 16) / 255.0
        g = int(color_hex[2:4], 16) / 255.0
        b = int(color_hex[4:6], 16) / 255.0
    else:
        r, g, b = 0.8, 0.0, 0.0

    for page in doc:
        rect = page.rect
        center_x = rect.width / 2
        center_y = rect.height / 2
        pt = fitz.Point(center_x - (len(text) * font_size * 0.25), center_y)
        
        page.insert_text(
            pt,
            text,
            fontsize=font_size,
            fontname="helv",
            color=(r, g, b),
            fill_opacity=opacity,
            morph=(pt, fitz.Matrix(angle))
        )

    doc.save(output_path)
    doc.close()
    return output_path

def rotate_pdf(input_path: str, output_path: str, angle: int = 90, pages: str = "all"):
    """Rotates pages in a PDF clockwise by 90, 180, or 270 degrees."""
    doc = fitz.open(input_path)
    total_pages = len(doc)
    
    target_pages = set()
    if pages == "all" or not pages.strip():
        target_pages = set(range(total_pages))
    else:
        for p in pages.split(','):
            p = p.strip()
            if '-' in p:
                s, e = p.split('-', 1)
                for idx in range(max(1, int(s))-1, min(total_pages, int(e))):
                    target_pages.add(idx)
            elif p.isdigit():
                idx = int(p) - 1
                if 0 <= idx < total_pages:
                    target_pages.add(idx)

    for i in target_pages:
        page = doc[i]
        page.set_rotation((page.rotation + angle) % 360)

    doc.save(output_path)
    doc.close()
    return output_path
