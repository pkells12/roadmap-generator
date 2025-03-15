# roadmap_generator.py
from api_client import ClaudeClient

async def generate_roadmap(idea_description, status_callback=None):
    """
    Generate a coding roadmap based on the user's idea description.
    
    Args:
        idea_description: Description of the app idea
        status_callback: Optional callback function to update UI about current progress
    """
    client = ClaudeClient()
    
    if status_callback:
        status_callback("🔄 STEP 1/2: Generating initial roadmap draft...")
    
    initial_roadmap = client.generate_initial_roadmap(idea_description)
    
    if status_callback:
        status_callback("🧠 STEP 2/2: REFLECTION IN PROGRESS - Analyzing and improving the roadmap...")
    
    final_roadmap = client.reflect_on_roadmap(initial_roadmap, idea_description)
    
    if status_callback:
        status_callback("✅ Roadmap generation complete!")
    
    return final_roadmap

def format_roadmap(roadmap_text):
    """
    Format the roadmap text if needed.
    This function could be expanded to add additional formatting or structure.
    """
    return roadmap_text