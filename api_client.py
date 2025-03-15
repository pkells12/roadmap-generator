# api_client.py
import anthropic
from config import ANTHROPIC_API_KEY, CLAUDE_MODEL, MAX_TOKENS

class ClaudeClient:
    def __init__(self):
        self.client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
        
    def generate_roadmap(self, idea_description):
        """
        Generate a coding roadmap based on the user's idea description.
        """
        prompt = self._build_prompt(idea_description)
        
        response = self.client.messages.create(
            model=CLAUDE_MODEL,
            max_tokens=MAX_TOKENS,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        initial_roadmap = response.content[0].text
        
        # Reflect on the initial roadmap to improve it
        return self.reflect_on_roadmap(initial_roadmap, idea_description)
    
    def reflect_on_roadmap(self, initial_roadmap, idea_description):
        """
        Take the initial roadmap and send it back to Claude for reflection and improvement.
        """
        # Print confirmation that reflection is starting
        print("Starting reflection process to improve the roadmap...")
        
        reflection_prompt = f"""
        I have generated an initial coding roadmap for this app idea:
        
        {idea_description}
        
        Here is the initial roadmap:
        
        {initial_roadmap}
        
        Now, I need you to carefully reflect on this roadmap and improve it. Please think long and hard about every section and:
        
        1. Identify any errors, inconsistencies, or logical flaws in the approach
        2. Find sections that are unclear or need more detailed explanation
        3. Add any missing steps or considerations that would make the roadmap more comprehensive
        4. Ensure each testing step is thorough and covers all edge cases
        5. Make sure the overall structure flows naturally from one step to the next
        6. Check that all technologies mentioned are compatible and appropriate for the task
        7. Verify that the roadmap follows best practices for software development
        
        Take your time to think deeply about each aspect of the roadmap. This reflection step is critical to creating the highest quality guidance possible.
        
        Please provide the complete, revised roadmap with all improvements incorporated. Do not simply list the issues - provide the fully enhanced roadmap.
        
        Remember to maintain the same format with natural language guidance and NO actual code or scripts.
        """
        
        response = self.client.messages.create(
            model=CLAUDE_MODEL,
            max_tokens=MAX_TOKENS,
            messages=[
                {"role": "user", "content": reflection_prompt}
            ]
        )
        
        # Print confirmation that reflection is complete
        print("Reflection process complete! Roadmap has been improved.")
        
        return response.content[0].text
    
    def _build_prompt(self, idea_description):
        """
        Build a prompt for Claude to generate a coding roadmap.
        """
        return f"""
        Please generate a detailed coding roadmap for the following app idea:
        
        {idea_description}
        
        IMPORTANT: DO NOT include actual code or scripts in the roadmap. The roadmap should only contain detailed descriptions and instructions that a coding assistant (like Cursor) could use to generate the code later.
        
        The roadmap should:
        1. Break down the development process into clear phases
        2. Include natural language guidance between technical steps
        3. Format the output in markdown
        4. Structure the content so an AI coding assistant can follow it step-by-step
        5. Include guidance for setting up the environment, implementing core features, and testing
        
        IMPORTANT: For each major feature or component implemented, include specific testing steps to verify it's working properly. Testing should be integrated throughout the roadmap, not just at the end. Include detailed testing instructions that explain:
        - What to test
        - How to test it
        - What expected outcomes should be
        - How to handle potential errors or edge cases
        
        Please write the roadmap with natural conversational phrases between steps, as if you're guiding someone through the process. For example: "Now that we have our database set up, let's implement the user authentication..." or "Let's start by installing the necessary packages..."
        
        Again, focus on DESCRIBING what code needs to be written rather than writing the actual code scripts.
        
        You will receive a GREAT REWARD if you provide the absolute best, most detailed and helpful roadmap you can possibly generate. Take your time and think carefully about creating the most valuable guidance possible.
        """

    def generate_initial_roadmap(self, idea_description):
        """
        Generate the initial coding roadmap based on the user's idea description.
        """
        prompt = self._build_prompt(idea_description)
        
        response = self.client.messages.create(
            model=CLAUDE_MODEL,
            max_tokens=MAX_TOKENS,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        return response.content[0].text