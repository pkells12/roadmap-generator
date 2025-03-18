# 🚀 Roadmap Generator
A powerful CLI tool that helps developers and project managers create comprehensive project roadmaps using Claude AI, with support for custom prompts and multiple output formats.

## ✨ Features
🤖 AI-Powered Generation - Create detailed roadmaps using Claude 3 Sonnet
📝 Custom Prompts - Use specialized prompts for different project types
📊 Structured Output - Get well-organized, hierarchical project plans
🎯 Project Phases - Automatically break down projects into logical phases
💾 Multiple Formats - Export roadmaps in markdown or text formats
🔄 Interactive Mode - Refine roadmaps through conversation with AI

## 📋 Requirements
- Python 3.10+
- Anthropic API key

## 🔧 Installation
### Option 1: Install from PyPI (Coming Soon)
```bash
pip install roadmap-generator
```

### Option 2: Install from Source
```bash
# Clone the repository
git clone https://github.com/pkells12/roadmap-generator.git
cd roadmap-generator

# Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows, use: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

## ⚙️ Configuration
Copy the example environment file and edit it with your API key:
```bash
cp .env.example .env
```

Add your API key to the .env file:
```
ANTHROPIC_API_KEY=your_api_key_here
```

## 🚀 Usage Examples
### Basic Generation
Generate a roadmap directly from the command line:
```bash
roadmap-generator generate "A mobile app for tracking daily habits with social features"
```

### Using a File for Input
```bash
roadmap-generator generate --idea-file project_description.txt
```

### Save Results to a File
```bash
roadmap-generator generate "My project idea" --output-file project_roadmap.md
```

### Choose Project Type
```bash
roadmap-generator generate "My project idea" --project-type mobile-app
```

### Interactive Mode
Work through the roadmap creation process step by step:
```bash
roadmap-generator interactive
```

## 📚 Command Options
```
generate [IDEA]          Generate a project roadmap
  --idea-file FILE       Load project description from a file
  --output-file FILE     Save roadmap to a file
  --project-type TYPE    Specify project type [web-app|mobile-app|api|cli]
  --format FORMAT        Output format [markdown|text]

interactive             Start an interactive roadmap session
```

## 🧪 Development
Run tests:
```bash
pytest
```

## 📄 License
MIT