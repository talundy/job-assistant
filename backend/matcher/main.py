import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def load_file(path):
    with open(path, 'r') as f:
        return f.read()

def format_prompt(resume_text, job_text):
    with open('prompts/match_prompt.txt') as f:
        template = f.read()
    return template.format(resume=resume_text, job=job_text)

def get_match_result(prompt):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.4
    )
    print(response.choices[0].message.content)

if __name__ == "__main__":
    resume = load_file("data/resume.txt")
    job = load_file("data/job_description.txt")
    prompt = format_prompt(resume, job)
    result = get_match_result(prompt)
    print(result)

