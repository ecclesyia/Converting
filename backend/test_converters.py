import os
import fitz
from PIL import Image
from converters.pdf_to_office import (
    pdf_to_docx, pdf_to_excel, pdf_to_pptx,
    pdf_to_images, pdf_to_text, extract_images_from_pdf
)
from converters.office_to_pdf import (
    docx_to_pdf, excel_to_pdf, pptx_to_pdf,
    images_to_pdf, text_to_pdf
)
from converters.pdf_ops import (
    merge_pdfs, split_pdf, compress_pdf,
    protect_pdf, unlock_pdf, watermark_pdf, rotate_pdf
)

def run_tests():
    test_dir = os.path.join(os.path.dirname(__file__), "test_artifacts")
    os.makedirs(test_dir, exist_ok=True)
    
    print("=== STARTING CONVERSION ENGINE TESTS ===")

    # 1. Create a dummy test PDF
    dummy_pdf = os.path.join(test_dir, "sample.pdf")
    doc = fitz.open()
    page1 = doc.new_page()
    page1.insert_text(fitz.Point(50, 50), "Hello from OmniPDF! This is page 1.", fontsize=18)
    page1.insert_text(fitz.Point(50, 100), "Here is a paragraph of sample text to test conversion fidelity.", fontsize=12)
    
    page2 = doc.new_page()
    page2.insert_text(fitz.Point(50, 50), "This is page 2 with additional content.", fontsize=18)
    doc.save(dummy_pdf)
    doc.close()
    print("[PASS] Dummy PDF created")

    # 2. PDF -> Word
    docx_out = os.path.join(test_dir, "sample_out.docx")
    pdf_to_docx(dummy_pdf, docx_out)
    assert os.path.exists(docx_out), "PDF to Word failed"
    print("[PASS] PDF to Word (.docx) verified")

    # 3. PDF -> Excel
    xlsx_out = os.path.join(test_dir, "sample_out.xlsx")
    pdf_to_excel(dummy_pdf, xlsx_out)
    assert os.path.exists(xlsx_out), "PDF to Excel failed"
    print("[PASS] PDF to Excel (.xlsx) verified")

    # 4. PDF -> PowerPoint
    pptx_out = os.path.join(test_dir, "sample_out.pptx")
    pdf_to_pptx(dummy_pdf, pptx_out)
    assert os.path.exists(pptx_out), "PDF to PowerPoint (.pptx) verified"
    print("[PASS] PDF to PowerPoint (.pptx) verified")

    # 5. PDF -> Images ZIP
    images_zip = os.path.join(test_dir, "sample_images.zip")
    pdf_to_images(dummy_pdf, images_zip)
    assert os.path.exists(images_zip), "PDF to Images failed"
    print("[PASS] PDF to Images (.zip) verified")

    # 6. PDF -> Text
    txt_out = os.path.join(test_dir, "sample_out.txt")
    pdf_to_text(dummy_pdf, txt_out)
    assert os.path.exists(txt_out), "PDF to Text failed"
    print("[PASS] PDF to Text (.txt) verified")

    # 7. Images -> PDF
    img1 = os.path.join(test_dir, "img1.png")
    Image.new('RGB', (200, 200), color=(255, 100, 100)).save(img1)
    img2 = os.path.join(test_dir, "img2.png")
    Image.new('RGB', (200, 200), color=(100, 100, 255)).save(img2)
    
    img_pdf = os.path.join(test_dir, "from_images.pdf")
    images_to_pdf([img1, img2], img_pdf)
    assert os.path.exists(img_pdf), "Images to PDF failed"
    print("[PASS] Images to PDF verified")

    # 8. Text -> PDF
    text_pdf = os.path.join(test_dir, "from_text.pdf")
    text_to_pdf("This is raw markdown and text rendered directly into a PDF!", text_pdf, is_file=False)
    assert os.path.exists(text_pdf), "Text to PDF failed"
    print("[PASS] Text to PDF verified")

    # 9. Merge PDF
    merged_pdf = os.path.join(test_dir, "merged.pdf")
    merge_pdfs([dummy_pdf, img_pdf], merged_pdf)
    assert os.path.exists(merged_pdf), "PDF Merge failed"
    print("[PASS] PDF Merge verified")

    # 10. Split PDF
    split_zip = os.path.join(test_dir, "split.zip")
    split_pdf(dummy_pdf, split_zip)
    assert os.path.exists(split_zip), "PDF Split failed"
    print("[PASS] PDF Split (.zip) verified")

    # 11. Watermark PDF
    watermark_out = os.path.join(test_dir, "watermarked.pdf")
    watermark_pdf(dummy_pdf, watermark_out, text="CONFIDENTIAL", opacity=0.4, angle=45)
    assert os.path.exists(watermark_out), "PDF Watermark failed"
    print("[PASS] PDF Watermark verified")

    # 12. Password Protect & Unlock
    protected_pdf = os.path.join(test_dir, "protected.pdf")
    protect_pdf(dummy_pdf, protected_pdf, password="SecretPassword123")
    assert os.path.exists(protected_pdf), "PDF Protect failed"
    print("[PASS] PDF Password Protect verified")

    unlocked_pdf = os.path.join(test_dir, "unlocked.pdf")
    unlock_pdf(protected_pdf, unlocked_pdf, password="SecretPassword123")
    assert os.path.exists(unlocked_pdf), "PDF Unlock verified"
    print("[PASS] PDF Password Unlock verified")

    # 13. Rotate PDF
    rotated_pdf = os.path.join(test_dir, "rotated.pdf")
    rotate_pdf(dummy_pdf, rotated_pdf, angle=90)
    assert os.path.exists(rotated_pdf), "PDF Rotate failed"
    print("[PASS] PDF Rotate verified")

    print("\nALL 13 TEST CONVERSIONS PASSED WITH 100% SUCCESS!")

if __name__ == "__main__":
    run_tests()
