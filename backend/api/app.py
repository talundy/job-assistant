from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys
from dotenv import load_dotenv

# Add the parent directory to the path so we can import the matcher module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from matcher.main import format_prompt, get_match_result

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'Resume-Job Matcher API is running'})

@app.route('/analyze', methods=['POST'])
def analyze_match():
    """Analyze resume against job description"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        resume_text = data.get('resume')
        job_description = data.get('job_description')
        
        if not resume_text or not job_description:
            return jsonify({'error': 'Both resume and job_description are required'}), 400
        
        # Format the prompt using the existing function
        prompt = format_prompt(resume_text, job_description)
        
        # Get the analysis result
        analysis_result = get_match_result(prompt)
        
        return jsonify({
            'success': True,
            'analysis': analysis_result,
            'message': 'Analysis completed successfully'
        })
        
    except Exception as e:
        print(f"Error in analyze_match: {str(e)}")
        return jsonify({
            'error': 'An error occurred during analysis',
            'message': str(e)
        }), 500

@app.route('/test', methods=['GET'])
def test_endpoint():
    """Test endpoint for development"""
    return jsonify({
        'message': 'API is working!',
        'endpoints': {
            'health': '/health',
            'analyze': '/analyze (POST)',
            'test': '/test'
        }
    })

if __name__ == '__main__':
    # For development
    app.run(debug=True, host='0.0.0.0', port=5000)
else:
    # For production deployment
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000))) 