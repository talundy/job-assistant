// Global variables to store uploaded files
let resumeFile = null;
let jobFile = null;

// API endpoint - you'll need to update this to your deployed backend URL
const API_ENDPOINT = 'https://your-backend-url.com/analyze';

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    setupFileUploads();
    setupAnalyzeButton();
});

function setupFileUploads() {
    // Resume upload
    const resumeUpload = document.getElementById('resumeUpload');
    const resumeFileInput = document.getElementById('resumeFile');
    
    resumeUpload.addEventListener('click', () => resumeFileInput.click());
    resumeFileInput.addEventListener('change', (e) => handleFileSelect(e, 'resume'));
    
    // Job description upload
    const jobUpload = document.getElementById('jobUpload');
    const jobFileInput = document.getElementById('jobFile');
    
    jobUpload.addEventListener('click', () => jobFileInput.click());
    jobFileInput.addEventListener('change', (e) => handleFileSelect(e, 'job'));
}

function handleFileSelect(event, type) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    const allowedTypes = ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
        alert('Please upload a valid file type (PDF, DOC, DOCX, or TXT)');
        return;
    }
    
    // Store file
    if (type === 'resume') {
        resumeFile = file;
        showFilePreview(file, 'resume');
    } else {
        jobFile = file;
        showFilePreview(file, 'job');
    }
    
    updateAnalyzeButton();
}

function showFilePreview(file, type) {
    const uploadArea = document.getElementById(`${type}Upload`);
    const preview = document.getElementById(`${type}Preview`);
    const nameElement = document.getElementById(`${type}Name`);
    
    // Hide upload area and show preview
    uploadArea.style.display = 'none';
    preview.style.display = 'flex';
    nameElement.textContent = file.name;
}

function removeFile(type) {
    const uploadArea = document.getElementById(`${type}Upload`);
    const preview = document.getElementById(`${type}Preview`);
    const fileInput = document.getElementById(`${type}File`);
    
    // Clear file
    if (type === 'resume') {
        resumeFile = null;
    } else {
        jobFile = null;
    }
    
    // Reset UI
    uploadArea.style.display = 'block';
    preview.style.display = 'none';
    fileInput.value = '';
    
    updateAnalyzeButton();
}

function updateAnalyzeButton() {
    const analyzeBtn = document.getElementById('analyzeBtn');
    analyzeBtn.disabled = !(resumeFile && jobFile);
}

function setupAnalyzeButton() {
    const analyzeBtn = document.getElementById('analyzeBtn');
    analyzeBtn.addEventListener('click', analyzeMatch);
}

async function analyzeMatch() {
    if (!resumeFile || !jobFile) {
        alert('Please upload both resume and job description files');
        return;
    }
    
    // Show loading state
    showLoading(true);
    hideResults();
    
    try {
        // Extract text from files
        const resumeText = await extractTextFromFile(resumeFile);
        const jobText = await extractTextFromFile(jobFile);
        
        // Send to API
        const result = await sendToAPI(resumeText, jobText);
        
        // Display results
        displayResults(result);
        
    } catch (error) {
        console.error('Error during analysis:', error);
        alert('An error occurred during analysis. Please try again.');
    } finally {
        showLoading(false);
    }
}

async function extractTextFromFile(file) {
    return new Promise((resolve, reject) => {
        if (file.type === 'text/plain') {
            // Handle text files
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file);
        } else {
            // For now, we'll use a simple approach for PDF/DOC files
            // In a real implementation, you'd want to use libraries like pdf.js or mammoth.js
            alert('PDF and DOC file parsing is not yet implemented. Please use TXT files for now.');
            reject(new Error('Unsupported file type'));
        }
    });
}

async function sendToAPI(resumeText, jobText) {
    const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            resume: resumeText,
            job_description: jobText
        })
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
}

function displayResults(result) {
    // Extract score from the analysis text
    const score = extractScore(result.analysis);
    
    // Update score display
    document.getElementById('matchScore').textContent = score;
    
    // Parse and display analysis sections
    const sections = parseAnalysis(result.analysis);
    
    // Update strengths
    const strengthsList = document.getElementById('strengthsList');
    strengthsList.innerHTML = '';
    sections.strengths.forEach(strength => {
        const li = document.createElement('li');
        li.textContent = strength;
        strengthsList.appendChild(li);
    });
    
    // Update gaps
    const gapsList = document.getElementById('gapsList');
    gapsList.innerHTML = '';
    sections.gaps.forEach(gap => {
        const li = document.createElement('li');
        li.textContent = gap;
        gapsList.appendChild(li);
    });
    
    // Update suggestions
    const suggestionsList = document.getElementById('suggestionsList');
    suggestionsList.innerHTML = '';
    sections.suggestions.forEach(suggestion => {
        const li = document.createElement('li');
        li.textContent = suggestion;
        suggestionsList.appendChild(li);
    });
    
    // Show results
    showResults();
}

function extractScore(analysis) {
    // Look for a score pattern in the analysis text
    const scoreMatch = analysis.match(/(\d+)/);
    return scoreMatch ? scoreMatch[1] : '75'; // Default to 75 if no score found
}

function parseAnalysis(analysis) {
    // Simple parsing of the analysis text
    // This is a basic implementation - you might want to improve this
    const lines = analysis.split('\n');
    const sections = {
        strengths: [],
        gaps: [],
        suggestions: []
    };
    
    let currentSection = null;
    
    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;
        
        if (trimmedLine.toLowerCase().includes('strength')) {
            currentSection = 'strengths';
        } else if (trimmedLine.toLowerCase().includes('gap') || trimmedLine.toLowerCase().includes('missing')) {
            currentSection = 'gaps';
        } else if (trimmedLine.toLowerCase().includes('suggest') || trimmedLine.toLowerCase().includes('bullet')) {
            currentSection = 'suggestions';
        } else if (currentSection && trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) {
            sections[currentSection].push(trimmedLine.substring(1).trim());
        }
    }
    
    return sections;
}

function showLoading(show) {
    const loadingSection = document.getElementById('loadingSection');
    loadingSection.style.display = show ? 'block' : 'none';
}

function showResults() {
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.style.display = 'block';
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

function hideResults() {
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.style.display = 'none';
}

// For development/testing purposes, you can use this mock function
function mockAnalysis() {
    return {
        analysis: `Score: 85

Strengths:
- Strong technical background in Python and machine learning
- Relevant experience with data analysis projects
- Good communication skills demonstrated in previous roles

Gaps:
- Limited experience with cloud platforms (AWS/Azure)
- No direct experience with the specific industry
- Missing certification in relevant technologies

Suggestions:
- Add bullet point about cloud computing experience
- Include specific metrics from previous projects
- Highlight transferable skills from other industries`
    };
} 