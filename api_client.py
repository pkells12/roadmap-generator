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
        8. Add implementation details where explanations could be more specific
        9. Include necessary context and rationale for technical decisions
        
        VERY IMPORTANT: The final roadmap MUST be between 6000 and 8000 tokens in length. Make it extremely detailed and comprehensive.
        
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
        
        return response.content[0].text
    
    def reflect_on_roadmap_with_answers(self, initial_roadmap, idea_description, user_answers):
        """
        Take the initial roadmap and user answers to customize and improve the roadmap.
        
        Args:
            initial_roadmap: The initial roadmap text
            idea_description: Original idea description
            user_answers: Dictionary of user answers to customization questions
        """
        # Format user answers for inclusion in the prompt
        formatted_answers = "\n".join([f"- {key}: {value}" for key, value in user_answers.items()])
        
        reflection_prompt = f"""
        I have generated an initial coding roadmap for this app idea:
        
        {idea_description}
        
        Here is the initial roadmap:
        
        {initial_roadmap}
        
        The user has provided the following additional information about their project requirements:
        
        {formatted_answers}
        
        Now, I need you to customize and improve this roadmap based on both your analysis and the user's specific requirements. Please:
        
        1. Incorporate the user's specific requirements into the roadmap
        2. Adjust timelines, technologies, and approaches based on their team size and experience
        3. Prioritize features based on their must-have requirements
        4. Adapt the technical approach for their target platforms
        5. Identify any errors, inconsistencies, or logical flaws in the approach
        6. Find sections that are unclear or need more detailed explanation
        7. Add any missing steps or considerations that would make the roadmap more comprehensive
        8. Ensure each testing step is thorough and covers all edge cases
        9. Make sure the overall structure flows naturally from one step to the next
        10. Add implementation details where explanations could be more specific
        11. Include necessary context and rationale for technical decisions
        
        VERY IMPORTANT: The final roadmap MUST be between 6000 and 8000 tokens in length. Make it extremely detailed and comprehensive, with enough specificity that an AI coding assistant could implement the entire project without additional clarification from the user.
        
        Take your time to think deeply about each aspect of the roadmap. This customization step is critical to creating the highest quality guidance possible for their specific needs.
        
        Please provide the complete, revised roadmap with all improvements incorporated. Do not simply list the changes - provide the fully enhanced and customized roadmap.
        
        Remember to maintain the same format with natural language guidance and NO actual code or scripts.
        """
        
        response = self.client.messages.create(
            model=CLAUDE_MODEL,
            max_tokens=MAX_TOKENS,
            messages=[
                {"role": "user", "content": reflection_prompt}
            ]
        )
        
        return response.content[0].text
    
    def _build_prompt(self, idea_description):
        """
        Build a prompt for Claude to generate a coding roadmap.
        """
        return f"""
        Please generate a very detailed and comprehensive coding roadmap for the following app idea:
        
        {idea_description}
        
        IMPORTANT: Your roadmap must be between 6000 and 8000 tokens in length. Make it extremely detailed and comprehensive.
        
        DO NOT include actual code or scripts in the roadmap. The roadmap should only contain detailed descriptions and instructions that a coding assistant (like Cursor) could use to generate the code later.
        
        The roadmap should:
        1. Break down the development process into clear phases
        2. Include natural language guidance between technical steps
        3. Format the output in markdown
        4. Structure the content so an AI coding assistant can follow it step-by-step
        5. Include guidance for setting up the environment, implementing core features, and testing
        6. Be extremely detailed - provide enough information that an AI coding assistant could implement the entire project without additional clarification from the user
        7. For each component, include specific implementation details and considerations
        8. Provide rationale for technical decisions and architecture choices
        
        For each major feature or component:
        - Break it down into granular sub-tasks
        - Describe the data structures or models needed
        - Explain interfaces and connections to other components
        - Detail configuration requirements
        - Include specific testing steps to verify functionality
        
        IMPORTANT: Testing should be integrated throughout the roadmap, not just at the end. For each component, include detailed testing instructions that explain:
        - What to test (specific functionalities, edge cases, etc.)
        - How to test it (test approaches, tools, and methods)
        - What expected outcomes should be
        - How to handle potential errors or edge cases
        - How to verify that the component integrates properly with the rest of the system
        
        Please write the roadmap with natural conversational phrases between steps, as if you're guiding someone through the process. For example: "Now that we have our database set up, let's implement the user authentication..." or "Let's start by installing the necessary packages..."
        
        Again, focus on DESCRIBING what code needs to be written rather than writing the actual code scripts.
        
        As a guide, ensure your roadmap is extremely detailed and between 6000-8000 tokens in length. This level of detail is necessary for an AI coding assistant to implement the project without further clarification.
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
        
    def generate_questions_for_roadmap(self, roadmap, idea_description):
        """
        Generate specific questions based on the roadmap content.
        
        Args:
            roadmap: The initial roadmap text
            idea_description: Original idea description
        
        Returns:
            Dictionary of question_key: question_text pairs
        """
        questions_prompt = f"""
        I have generated an initial coding roadmap for this app idea:
        
        {idea_description}
        
        Here is the initial roadmap:
        
        {roadmap}
        
        Based on this specific roadmap, generate 5-10 questions that would help clarify and customize the roadmap for this particular project. 
        
        Analyze the roadmap carefully and identify areas where additional user input would significantly improve the roadmap's specificity and relevance. Focus on:
        - Technical decisions that are unclear or could have multiple valid approaches
        - Features that might need prioritization or clarification
        - Resource or timeline considerations specific to this project
        - Domain-specific questions that would help tailor the roadmap better
        - Design or architecture choices that would benefit from user preferences
        
        Each question should be directly related to specific content in the roadmap, not generic questions that could apply to any project.
        
        Return your response in the following JSON format WITHOUT any explanations or additional text:
        {{"question_key_1": "Specific question text 1?", "question_key_2": "Specific question text 2?", ...}}
        
        The question keys should be brief slug-like identifiers related to the question content.
        """
        
        response = self.client.messages.create(
            model=CLAUDE_MODEL,
            max_tokens=MAX_TOKENS,
            messages=[
                {"role": "user", "content": questions_prompt}
            ]
        )
        
        # Extract the JSON dictionary from the response
        response_text = response.content[0].text
        
        # The response might include markdown code block formatting, so we need to clean it
        import json
        import re
        
        # Try to extract JSON content if wrapped in code blocks or has extra text
        json_pattern = r'```(?:json)?\s*({.*?})\s*```|({.*})'
        match = re.search(json_pattern, response_text, re.DOTALL)
        
        if match:
            json_str = match.group(1) or match.group(2)
            try:
                return json.loads(json_str)
            except json.JSONDecodeError:
                pass
        
        # If the above doesn't work, try parsing the whole response as JSON
        try:
            return json.loads(response_text)
        except json.JSONDecodeError:
            # Fallback to default questions if parsing fails
            return {
                "target_platform": "What are your target platforms/environments?",
                "timeline": "What is your expected timeline for this project?",
                "team_size": "What is your team size and composition?",
                "must_have_features": "What features do you consider must-haves for your MVP?",
                "tech_stack": "Do you have preferred technologies or frameworks?",
                "budget": "Do you have budget constraints that would impact the roadmap?",
                "prior_experience": "What is your team's prior experience with similar projects?",
                "deployment": "What are your deployment or distribution requirements?",
                "scaling": "What are your scaling expectations (users, data volume, etc.)?",
                "integration": "Are there existing systems you need to integrate with?"
            }