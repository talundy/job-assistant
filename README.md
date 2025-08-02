# job-assistant

This project is a modular, self-contained project that can be used on its own or as
    a component in a yet-undeveloped larger job-hunt project. 

Within its own context, this project is currently capable of comparing a user's resume with a job description
    and offering a simple score and analysis of the current compatibility of the resume with the job description given. 
    The resume and job description are stored in a simple .txt file within the data/ folder. 

Future of this project (ideas): 
    - Simple frontend, hosted on my personal portfolio website/github portfolio allowing a user to upload their resume
        and link the job description to use the service.
    - More detailed analysis, data-driven, not just prompt engineering and going off vibes.
    - Gradually host more and more of the service online using AWS services where possible.
    - Import linkedin profile instead of a single resume. Use this profile to create a dedicated resume for each job description. 
        Then compare and iterate. 
    - Build integration with larger project components. This might include n8n integration.

Within the context of the future, larger project, this service would do exactly what it would do as it's own service,
    but streamlined to work within the context of the larger project for efficiency. This might look like:
    - importing a list or database of job descriptions for running more analyses at a time
    - utilizing less human-readable formats in the import and export stages for efficiency
    - exporting the many resumes created to match these job descriptions
