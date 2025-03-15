# ui.py
from textual.app import App, ComposeResult
from textual.widgets import Header, Footer, Input, TextArea, Static
from textual.containers import Container, Vertical
from textual import events
from rich.markdown import Markdown
from textual.widgets import LoadingIndicator

class RoadmapGeneratorApp(App):
    CSS = """
    Screen {
        background: #1f1f1f;
    }
    
    Header {
        background: #333;
        color: #0ce;
    }
    
    Footer {
        background: #333;
        color: #0ce;
    }
    
    #idea-input {
        margin: 1 2;
        height: 5;
        border: solid #0ce;
    }
    
    #roadmap-output {
        margin: 1 2;
        height: 30;
        overflow-y: scroll;
        border: solid #0ce;
    }
    
    #status {
        color: #0ce;
        text-align: center;
        margin: 1 0;
        background: #2a2a2a;
        padding: 1;
        border: solid #0ce;
    }
    
    .button {
        margin: 1 2;
        width: 20;
        align: center middle;
        background: #333;
        color: #0ce;
    }
    
    .button:hover {
        background: #0ce;
        color: #333;
    }
    
    #loading {
        display: none;
    }
    
    .hidden {
        display: none;
    }
    """
    
    def compose(self) -> ComposeResult:
        yield Header(show_clock=True)
        yield Container(
            Static("Enter your app idea:", id="prompt"),
            Input(placeholder="Describe your app idea here...", id="idea-input"),
            Static("", id="status"),
            Static("Generate Roadmap", classes="button", id="generate-btn"),
            LoadingIndicator(id="loading", classes="hidden"),
            Static("Roadmap will appear here:", id="output-label"),
            TextArea("", id="roadmap-output", language="markdown"),
            classes="main-container"
        )
        yield Footer()
    
    def on_mount(self) -> None:
        self.title = "Coding Roadmap Generator"
    
    def on_static_click(self, event: events.Click) -> None:
        if event.static.id == "generate-btn":
            self.run_async(self.generate_roadmap())
    
    def on_input_submitted(self) -> None:
        self.run_async(self.generate_roadmap())
    
    async def generate_roadmap(self) -> None:
        # Get the user's idea
        idea_input = self.query_one("#idea-input")
        idea_text = idea_input.value
        
        if not idea_text:
            self.query_one("#status").update("Please enter an app idea first.")
            return
        
        # Get widgets
        status = self.query_one("#status")
        loading = self.query_one("#loading")
        
        # Show loading indicator
        loading.remove_class("hidden")
        
        # Define status update callback with special handling for reflection step
        def update_status(message):
            if "REFLECTION" in message:
                # Add special styling for reflection messages
                status.styles.background = "#2c1457"  # Darker purple for reflection step
                status.styles.border_style = "double"
            else:
                # Reset to normal styling
                status.styles.background = "#2a2a2a"
                status.styles.border_style = "solid"
                
            status.update(message)
            self.refresh()
        
        # Initial status update
        update_status("Starting roadmap generation process...")
        
        # Generate roadmap with status updates
        from roadmap_generator import generate_roadmap
        roadmap = await self.call_later(generate_roadmap, idea_text, update_status)
        
        # Hide loading indicator
        loading.add_class("hidden")
        
        # Reset styles
        status.styles.background = "#2a2a2a"
        status.styles.border_style = "solid"
        
        # Display the generated roadmap
        output = self.query_one("#roadmap-output")
        output.load_text(roadmap)
        
        update_status("✅ Roadmap generation complete! Ready for your next idea.")