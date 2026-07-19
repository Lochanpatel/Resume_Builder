"""
Unit tests for Resume Builder API
Run with: pytest
"""

import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

@pytest.fixture
def sample_resume():
    return {
        "name": "Jane Doe",
        "title": "Frontend Engineer",
        "email": "jane@example.com",
        "phone": "(555) 123-4567",
        "website": "github.com/janedoe",
        "summary": "Talented frontend engineer",
        "experience": [
            {
                "role": "Senior Engineer",
                "company": "Tech Corp",
                "startDate": "2021",
                "endDate": "Present",
                "description": "Led UI development"
            }
        ],
        "education": [
            {
                "school": "University",
                "degree": "B.S. CS",
                "years": "2018"
            }
        ],
        "skillsText": "React, JavaScript"
    }

def test_root_endpoint():
    """Test API root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

def test_health_check():
    """Test health check endpoint"""
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_create_resume(sample_resume):
    """Test creating a resume"""
    response = client.post("/api/resumes", json=sample_resume)
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Resume created successfully"
    assert "id" in data

def test_create_resume_missing_email(sample_resume):
    """Test creating resume with invalid email"""
    sample_resume["email"] = "invalid-email"
    response = client.post("/api/resumes", json=sample_resume)
    assert response.status_code == 422  # Validation error

def test_create_resume_empty_name(sample_resume):
    """Test creating resume with empty name"""
    sample_resume["name"] = ""
    response = client.post("/api/resumes", json=sample_resume)
    assert response.status_code == 422

def test_validate_resume(sample_resume):
    """Test resume validation endpoint"""
    response = client.post("/api/validate", json=sample_resume)
    assert response.status_code == 200
    assert response.json()["valid"] == True

def test_list_resumes(sample_resume):
    """Test listing resumes"""
    # Create a resume first
    create_response = client.post("/api/resumes", json=sample_resume)
    resume_id = create_response.json()["id"]
    
    # List resumes
    response = client.get("/api/resumes")
    assert response.status_code == 200
    assert response.json()["count"] >= 1
    assert resume_id in response.json()["resumes"]

def test_get_resume(sample_resume):
    """Test retrieving a specific resume"""
    # Create a resume
    create_response = client.post("/api/resumes", json=sample_resume)
    resume_id = create_response.json()["id"]
    
    # Get the resume
    response = client.get(f"/api/resumes/{resume_id}")
    assert response.status_code == 200
    assert response.json()["id"] == resume_id
    assert response.json()["data"]["name"] == sample_resume["name"]

def test_get_nonexistent_resume():
    """Test retrieving a non-existent resume"""
    response = client.get("/api/resumes/nonexistent")
    assert response.status_code == 404

def test_update_resume(sample_resume):
    """Test updating a resume"""
    # Create a resume
    create_response = client.post("/api/resumes", json=sample_resume)
    resume_id = create_response.json()["id"]
    
    # Update the resume
    sample_resume["name"] = "John Smith"
    response = client.put(f"/api/resumes/{resume_id}", json=sample_resume)
    assert response.status_code == 200
    assert response.json()["data"]["name"] == "John Smith"

def test_update_nonexistent_resume(sample_resume):
    """Test updating a non-existent resume"""
    response = client.put("/api/resumes/nonexistent", json=sample_resume)
    assert response.status_code == 404

def test_delete_resume(sample_resume):
    """Test deleting a resume"""
    # Create a resume
    create_response = client.post("/api/resumes", json=sample_resume)
    resume_id = create_response.json()["id"]
    
    # Delete the resume
    response = client.delete(f"/api/resumes/{resume_id}")
    assert response.status_code == 200
    assert response.json()["message"] == "Resume deleted successfully"
    
    # Verify it's deleted
    get_response = client.get(f"/api/resumes/{resume_id}")
    assert get_response.status_code == 404

def test_delete_nonexistent_resume():
    """Test deleting a non-existent resume"""
    response = client.delete("/api/resumes/nonexistent")
    assert response.status_code == 404
