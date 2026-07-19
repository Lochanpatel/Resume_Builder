"""
Resume Builder Backend API
FastAPI server for resume management and storage
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, field_validator
from typing import List, Optional
from datetime import datetime

# Initialize FastAPI app
app = FastAPI(
    title="Resume Builder API",
    description="API for managing resume data",
    version="0.1.0"
)

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for validation
class ExperienceEntry(BaseModel):
    role: str
    company: str
    startDate: str
    endDate: str
    description: str

class EducationEntry(BaseModel):
    school: str
    degree: str
    years: str

class ResumeData(BaseModel):
    name: str
    title: str
    email: EmailStr
    phone: str
    website: Optional[str] = None
    summary: str
    experience: List[ExperienceEntry]
    education: List[EducationEntry]
    skillsText: str

    @field_validator('name')
    @classmethod
    def name_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Name cannot be empty')
        return v

# In-memory storage (replace with database in production)
stored_resumes = {}

# Routes
@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Resume Builder API",
        "status": "online",
        "version": "0.1.0"
    }

@app.get("/api/health")
async def health_check():
    """API health check"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/api/resumes")
async def create_resume(resume: ResumeData):
    """Create a new resume"""
    try:
        resume_id = datetime.now().timestamp()
        stored_resumes[str(resume_id)] = resume.model_dump()
        return {
            "id": str(resume_id),
            "message": "Resume created successfully",
            "data": resume
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/resumes/{resume_id}")
async def get_resume(resume_id: str):
    """Retrieve a resume by ID"""
    if resume_id not in stored_resumes:
        raise HTTPException(status_code=404, detail="Resume not found")
    return {
        "id": resume_id,
        "data": stored_resumes[resume_id]
    }

@app.put("/api/resumes/{resume_id}")
async def update_resume(resume_id: str, resume: ResumeData):
    """Update an existing resume"""
    if resume_id not in stored_resumes:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    try:
        stored_resumes[resume_id] = resume.model_dump()
        return {
            "id": resume_id,
            "message": "Resume updated successfully",
            "data": resume
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/api/resumes/{resume_id}")
async def delete_resume(resume_id: str):
    """Delete a resume"""
    if resume_id not in stored_resumes:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    del stored_resumes[resume_id]
    return {
        "id": resume_id,
        "message": "Resume deleted successfully"
    }

@app.get("/api/resumes")
async def list_resumes():
    """List all stored resumes"""
    return {
        "count": len(stored_resumes),
        "resumes": list(stored_resumes.keys())
    }

@app.post("/api/validate")
async def validate_resume(resume: ResumeData):
    """Validate resume data"""
    try:
        # Validation is done automatically by Pydantic
        return {
            "valid": True,
            "message": "Resume data is valid"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Validation error: {str(e)}")

# Run the app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
