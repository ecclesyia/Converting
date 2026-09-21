import os
import shutil
import tempfile
import uuid
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

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

app = FastAPI(
    title="OmniPDF Conversion API & Web Studio",
    description="Full-featured universal PDF & Office document converter web app inspired by iLovePDF",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TEMP_DIR = os.path.join(tempfile.gettempdir(), "omnipdf_temp")
os.makedirs(TEMP_DIR, exist_ok=True)

def cleanup_files(*paths):
    """Removes temporary files after the response has been sent."""
    for p in paths:
        try:
            if p and os.path.exists(p):
                if os.path.isdir(p):
                    shutil.rmtree(p, ignore_errors=True)
                else:
                    os.remove(p)
        except Exception:
            pass

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "OmniPDF Studio"}

@app.get("/api/tools")
def list_available_tools():
    return {"status": "active", "total_tools": 18}

# ---- CONVERT FROM PDF ----

@app.post("/api/convert/pdf-to-word")
async def handle_pdf_to_word(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    req_id = str(uuid.uuid4())
    in_path = os.path.join(TEMP_DIR, f"{req_id}_{file.filename}")
    out_path = os.path.join(TEMP_DIR, f"{req_id}_converted.docx")
    
    with open(in_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        pdf_to_docx(in_path, out_path)
        background_tasks.add_task(cleanup_files, in_path, out_path)
        base_name = os.path.splitext(file.filename or "doc")[0]
        return FileResponse(out_path, filename=f"{base_name}.docx", media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    except Exception as e:
        cleanup_files(in_path, out_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/convert/pdf-to-excel")
async def handle_pdf_to_excel(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    req_id = str(uuid.uuid4())
    in_path = os.path.join(TEMP_DIR, f"{req_id}_{file.filename}")
    out_path = os.path.join(TEMP_DIR, f"{req_id}_converted.xlsx")
    
    with open(in_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        pdf_to_excel(in_path, out_path)
        background_tasks.add_task(cleanup_files, in_path, out_path)
        base_name = os.path.splitext(file.filename or "sheet")[0]
        return FileResponse(out_path, filename=f"{base_name}.xlsx", media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    except Exception as e:
        cleanup_files(in_path, out_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/convert/pdf-to-powerpoint")
async def handle_pdf_to_powerpoint(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    req_id = str(uuid.uuid4())
    in_path = os.path.join(TEMP_DIR, f"{req_id}_{file.filename}")
    out_path = os.path.join(TEMP_DIR, f"{req_id}_converted.pptx")
    
    with open(in_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        pdf_to_pptx(in_path, out_path)
        background_tasks.add_task(cleanup_files, in_path, out_path)
        base_name = os.path.splitext(file.filename or "presentation")[0]
        return FileResponse(out_path, filename=f"{base_name}.pptx", media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation")
    except Exception as e:
        cleanup_files(in_path, out_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/convert/pdf-to-images")
async def handle_pdf_to_images(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    fmt: str = Form("png"),
    dpi: int = Form(150)
):
    req_id = str(uuid.uuid4())
    in_path = os.path.join(TEMP_DIR, f"{req_id}_{file.filename}")
    out_path = os.path.join(TEMP_DIR, f"{req_id}_images.zip")
    
    with open(in_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        pdf_to_images(in_path, out_path, fmt=fmt, dpi=dpi)
        background_tasks.add_task(cleanup_files, in_path, out_path)
        base_name = os.path.splitext(file.filename or "doc")[0]
        return FileResponse(out_path, filename=f"{base_name}_images.zip", media_type="application/zip")
    except Exception as e:
        cleanup_files(in_path, out_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/convert/pdf-to-text")
async def handle_pdf_to_text(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    req_id = str(uuid.uuid4())
    in_path = os.path.join(TEMP_DIR, f"{req_id}_{file.filename}")
    out_path = os.path.join(TEMP_DIR, f"{req_id}_extracted.txt")
    
    with open(in_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        pdf_to_text(in_path, out_path)
        background_tasks.add_task(cleanup_files, in_path, out_path)
        base_name = os.path.splitext(file.filename or "doc")[0]
        return FileResponse(out_path, filename=f"{base_name}.txt", media_type="text/plain")
    except Exception as e:
        cleanup_files(in_path, out_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/tools/extract-images")
async def handle_extract_images(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    req_id = str(uuid.uuid4())
    in_path = os.path.join(TEMP_DIR, f"{req_id}_{file.filename}")
    out_path = os.path.join(TEMP_DIR, f"{req_id}_assets.zip")
    
    with open(in_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        extract_images_from_pdf(in_path, out_path)
        background_tasks.add_task(cleanup_files, in_path, out_path)
        base_name = os.path.splitext(file.filename or "doc")[0]
        return FileResponse(out_path, filename=f"{base_name}_extracted_assets.zip", media_type="application/zip")
    except Exception as e:
        cleanup_files(in_path, out_path)
        raise HTTPException(status_code=500, detail=str(e))

# ---- CONVERT TO PDF ----

@app.post("/api/convert/word-to-pdf")
async def handle_word_to_pdf(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    req_id = str(uuid.uuid4())
    in_path = os.path.join(TEMP_DIR, f"{req_id}_{file.filename}")
    out_path = os.path.join(TEMP_DIR, f"{req_id}_converted.pdf")
    
    with open(in_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        docx_to_pdf(in_path, out_path)
        background_tasks.add_task(cleanup_files, in_path, out_path)
        base_name = os.path.splitext(file.filename or "doc")[0]
        return FileResponse(out_path, filename=f"{base_name}.pdf", media_type="application/pdf")
    except Exception as e:
        cleanup_files(in_path, out_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/convert/excel-to-pdf")
async def handle_excel_to_pdf(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    req_id = str(uuid.uuid4())
    in_path = os.path.join(TEMP_DIR, f"{req_id}_{file.filename}")
    out_path = os.path.join(TEMP_DIR, f"{req_id}_converted.pdf")
    
    with open(in_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        excel_to_pdf(in_path, out_path)
        background_tasks.add_task(cleanup_files, in_path, out_path)
        base_name = os.path.splitext(file.filename or "sheet")[0]
        return FileResponse(out_path, filename=f"{base_name}.pdf", media_type="application/pdf")
    except Exception as e:
        cleanup_files(in_path, out_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/convert/powerpoint-to-pdf")
async def handle_powerpoint_to_pdf(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    req_id = str(uuid.uuid4())
    in_path = os.path.join(TEMP_DIR, f"{req_id}_{file.filename}")
    out_path = os.path.join(TEMP_DIR, f"{req_id}_converted.pdf")
    
    with open(in_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        pptx_to_pdf(in_path, out_path)
        background_tasks.add_task(cleanup_files, in_path, out_path)
        base_name = os.path.splitext(file.filename or "deck")[0]
        return FileResponse(out_path, filename=f"{base_name}.pdf", media_type="application/pdf")
    except Exception as e:
        cleanup_files(in_path, out_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/convert/images-to-pdf")
async def handle_images_to_pdf(background_tasks: BackgroundTasks, files: List[UploadFile] = File(...)):
    req_id = str(uuid.uuid4())
    saved_paths = []
    
    for f in files:
        f_path = os.path.join(TEMP_DIR, f"{req_id}_{f.filename}")
        with open(f_path, "wb") as buffer:
            shutil.copyfileobj(f.file, buffer)
        saved_paths.append(f_path)
        
    out_path = os.path.join(TEMP_DIR, f"{req_id}_combined.pdf")
    try:
        images_to_pdf(saved_paths, out_path)
        background_tasks.add_task(cleanup_files, *saved_paths, out_path)
        return FileResponse(out_path, filename="images_combined.pdf", media_type="application/pdf")
    except Exception as e:
        cleanup_files(*saved_paths, out_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/convert/text-to-pdf")
async def handle_text_to_pdf(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    req_id = str(uuid.uuid4())
    in_path = os.path.join(TEMP_DIR, f"{req_id}_{file.filename}")
    out_path = os.path.join(TEMP_DIR, f"{req_id}_document.pdf")
    
    with open(in_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        text_to_pdf(in_path, out_path, is_file=True)
        background_tasks.add_task(cleanup_files, in_path, out_path)
        base_name = os.path.splitext(file.filename or "doc")[0]
        return FileResponse(out_path, filename=f"{base_name}.pdf", media_type="application/pdf")
    except Exception as e:
        cleanup_files(in_path, out_path)
        raise HTTPException(status_code=500, detail=str(e))

# ---- PDF TOOLS & UTILITIES ----

@app.post("/api/tools/merge")
async def handle_merge_pdf(background_tasks: BackgroundTasks, files: List[UploadFile] = File(...)):
    if len(files) < 2:
        raise HTTPException(status_code=400, detail="Please upload at least 2 PDF files to merge.")
    req_id = str(uuid.uuid4())
    saved_paths = []
    
    for f in files:
        f_path = os.path.join(TEMP_DIR, f"{req_id}_{f.filename}")
        with open(f_path, "wb") as buffer:
            shutil.copyfileobj(f.file, buffer)
        saved_paths.append(f_path)
        
    out_path = os.path.join(TEMP_DIR, f"{req_id}_merged.pdf")
    try:
        merge_pdfs(saved_paths, out_path)
        background_tasks.add_task(cleanup_files, *saved_paths, out_path)
        return FileResponse(out_path, filename="merged_document.pdf", media_type="application/pdf")
    except Exception as e:
        cleanup_files(*saved_paths, out_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/tools/split")
async def handle_split_pdf(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    ranges: Optional[str] = Form(None)
):
    req_id = str(uuid.uuid4())
    in_path = os.path.join(TEMP_DIR, f"{req_id}_{file.filename}")
    out_path = os.path.join(TEMP_DIR, f"{req_id}_split.zip")
    
    with open(in_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        split_pdf(in_path, out_path, page_ranges=ranges)
        background_tasks.add_task(cleanup_files, in_path, out_path)
        base_name = os.path.splitext(file.filename or "doc")[0]
        return FileResponse(out_path, filename=f"{base_name}_split.zip", media_type="application/zip")
    except Exception as e:
        cleanup_files(in_path, out_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/tools/compress")
async def handle_compress_pdf(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    level: str = Form("medium")
):
    req_id = str(uuid.uuid4())
    in_path = os.path.join(TEMP_DIR, f"{req_id}_{file.filename}")
    out_path = os.path.join(TEMP_DIR, f"{req_id}_compressed.pdf")
    
    with open(in_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        compress_pdf(in_path, out_path, level=level)
        background_tasks.add_task(cleanup_files, in_path, out_path)
        base_name = os.path.splitext(file.filename or "doc")[0]
        return FileResponse(out_path, filename=f"{base_name}_compressed.pdf", media_type="application/pdf")
    except Exception as e:
        cleanup_files(in_path, out_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/tools/protect")
async def handle_protect_pdf(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    password: str = Form(...)
):
    req_id = str(uuid.uuid4())
    in_path = os.path.join(TEMP_DIR, f"{req_id}_{file.filename}")
    out_path = os.path.join(TEMP_DIR, f"{req_id}_protected.pdf")
    
    with open(in_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        protect_pdf(in_path, out_path, password=password)
        background_tasks.add_task(cleanup_files, in_path, out_path)
        base_name = os.path.splitext(file.filename or "doc")[0]
        return FileResponse(out_path, filename=f"{base_name}_protected.pdf", media_type="application/pdf")
    except Exception as e:
        cleanup_files(in_path, out_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/tools/unlock")
async def handle_unlock_pdf(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    password: str = Form("")
):
    req_id = str(uuid.uuid4())
    in_path = os.path.join(TEMP_DIR, f"{req_id}_{file.filename}")
    out_path = os.path.join(TEMP_DIR, f"{req_id}_unlocked.pdf")
    
    with open(in_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        unlock_pdf(in_path, out_path, password=password)
        background_tasks.add_task(cleanup_files, in_path, out_path)
        base_name = os.path.splitext(file.filename or "doc")[0]
        return FileResponse(out_path, filename=f"{base_name}_unlocked.pdf", media_type="application/pdf")
    except Exception as e:
        cleanup_files(in_path, out_path)
        raise HTTPException(status_code=400, detail=f"Failed to unlock PDF: {str(e)}")

@app.post("/api/tools/watermark")
async def handle_watermark_pdf(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    text: str = Form("CONFIDENTIAL"),
    opacity: float = Form(0.35),
    angle: float = Form(45.0),
    font_size: int = Form(40),
    color: str = Form("#EF4444")
):
    req_id = str(uuid.uuid4())
    in_path = os.path.join(TEMP_DIR, f"{req_id}_{file.filename}")
    out_path = os.path.join(TEMP_DIR, f"{req_id}_watermarked.pdf")
    
    with open(in_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        watermark_pdf(in_path, out_path, text=text, opacity=opacity, angle=angle, font_size=font_size, color_hex=color)
        background_tasks.add_task(cleanup_files, in_path, out_path)
        base_name = os.path.splitext(file.filename or "doc")[0]
        return FileResponse(out_path, filename=f"{base_name}_watermarked.pdf", media_type="application/pdf")
    except Exception as e:
        cleanup_files(in_path, out_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/tools/rotate")
async def handle_rotate_pdf(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    angle: int = Form(90),
    pages: str = Form("all")
):
    req_id = str(uuid.uuid4())
    in_path = os.path.join(TEMP_DIR, f"{req_id}_{file.filename}")
    out_path = os.path.join(TEMP_DIR, f"{req_id}_rotated.pdf")
    
    with open(in_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        rotate_pdf(in_path, out_path, angle=angle, pages=pages)
        background_tasks.add_task(cleanup_files, in_path, out_path)
        base_name = os.path.splitext(file.filename or "doc")[0]
        return FileResponse(out_path, filename=f"{base_name}_rotated.pdf", media_type="application/pdf")
    except Exception as e:
        cleanup_files(in_path, out_path)
        raise HTTPException(status_code=500, detail=str(e))

# Mount Frontend static distribution if available
DIST_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
if os.path.exists(DIST_DIR):
    app.mount("/assets", StaticFiles(directory=os.path.join(DIST_DIR, "assets")), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        file_path = os.path.join(DIST_DIR, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(DIST_DIR, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
