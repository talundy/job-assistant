# Deployment Guide

This guide will help you deploy the Resume-Job Matcher frontend and backend.

## Frontend Deployment (GitHub Pages)

1. **Copy the frontend files to your GitHub Pages repository:**
   - Copy `frontend/index.html`, `frontend/styles.css`, and `frontend/script.js` to your GitHub Pages repository
   - You can place them in a subdirectory like `resume-matcher/` or directly in the root

2. **Update the API endpoint:**
   - Open `script.js` and update the `API_ENDPOINT` constant with your deployed backend URL
   - Example: `const API_ENDPOINT = 'https://your-backend.herokuapp.com/analyze';`

3. **Test locally first:**
   - Open the HTML file in your browser
   - Use browser developer tools to test the file upload functionality
   - Make sure the API endpoint is accessible

## Backend Deployment Options

### Option 1: Heroku (Recommended for beginners)

1. **Install Heroku CLI and create an account**

2. **Prepare for deployment:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Create Heroku app:**
   ```bash
   heroku create your-resume-matcher-api
   ```

4. **Set environment variables:**
   ```bash
   heroku config:set OPENAI_API_KEY=your_openai_api_key_here
   ```

5. **Deploy:**
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push heroku main
   ```

6. **Test the API:**
   ```bash
   heroku open
   # Or visit: https://your-resume-matcher-api.herokuapp.com/health
   ```

### Option 2: Railway

1. **Connect your GitHub repository to Railway**
2. **Set environment variables in Railway dashboard:**
   - `OPENAI_API_KEY`: Your OpenAI API key
3. **Deploy automatically from GitHub**

### Option 3: Render

1. **Create a new Web Service on Render**
2. **Connect your GitHub repository**
3. **Set environment variables:**
   - `OPENAI_API_KEY`: Your OpenAI API key
4. **Deploy automatically**

## Environment Variables

Make sure to set these environment variables in your deployment platform:

- `OPENAI_API_KEY`: Your OpenAI API key (required)

## Testing the Deployment

1. **Test the backend API:**
   ```bash
   curl https://your-backend-url.com/health
   ```

2. **Test the frontend:**
   - Visit your GitHub Pages URL
   - Upload test files and verify the analysis works

## Troubleshooting

### Common Issues:

1. **CORS errors:** Make sure the backend has CORS enabled (already included in the code)
2. **API key not found:** Verify the environment variable is set correctly
3. **File upload issues:** Check that the frontend is pointing to the correct API endpoint

### Local Development:

To test locally:

1. **Start the backend:**
   ```bash
   cd backend
   python api/app.py
   ```

2. **Update frontend API endpoint to:** `http://localhost:5000/analyze`

3. **Open the frontend HTML file in your browser**

## Security Notes

- Never commit your API keys to version control
- Use environment variables for sensitive data
- Consider adding rate limiting for production use
- Add input validation for file uploads in production 