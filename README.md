# Roadmap Generator

A tool to generate project roadmaps using the Claude AI API. This application helps developers create detailed roadmaps for their projects with AI assistance.

## Features

- Generate detailed project roadmaps using AI
- Export roadmaps in markdown format
- Example roadmaps included

## Setup

1. Clone the repository:
```bash
git clone https://github.com/pkells12/roadmap-generator.git
cd roadmap-generator
```

2. Create a virtual environment and install dependencies:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Set up your environment variables:
   - Copy `env.example` to `.env`
   - Add your Anthropic API key to the `.env` file

4. Run the application:
```bash
# Generate a roadmap and display it
python main.py generate "Your app idea description"

# Generate a roadmap and save it to a file
python main.py save "Your app idea description" --output-file my_roadmap.md
```

## Required API Key

This project requires an Anthropic API key to work. You can get one by signing up at [https://www.anthropic.com/](https://www.anthropic.com/).

## License

MIT 