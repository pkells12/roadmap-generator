# main.py
import typer
from roadmap_generator import generate_roadmap
import asyncio
from rich.console import Console
from rich.markdown import Markdown
from config import APP_NAME, APP_VERSION

app = typer.Typer()
console = Console()

@app.command()
def generate(idea: str = typer.Argument(..., help="Your app idea description")):
    """Generate a roadmap directly from the command line."""
    console.print(f"[bold cyan]{APP_NAME} v{APP_VERSION}[/bold cyan]")
    console.print("[yellow]Generating roadmap based on your idea...[/yellow]")
    
    # Run the generation in an event loop
    roadmap = asyncio.run(generate_roadmap(idea))
    
    console.print("\n[bold green]Roadmap generated:[/bold green]\n")
    console.print(Markdown(roadmap))

@app.command()
def save(idea: str = typer.Argument(..., help="Your app idea description"),
         output_file: str = typer.Option("roadmap.md", help="Output file name")):
    """Generate a roadmap and save it to a file."""
    console.print(f"[bold cyan]{APP_NAME} v{APP_VERSION}[/bold cyan]")
    console.print("[yellow]Generating roadmap based on your idea...[/yellow]")
    
    # Run the generation in an event loop
    roadmap = asyncio.run(generate_roadmap(idea))
    
    # Save to file
    with open(output_file, "w") as f:
        f.write(roadmap)
    
    console.print(f"\n[bold green]Roadmap saved to {output_file}[/bold green]")

if __name__ == "__main__":
    app()