import subprocess
from livereload import Server

def build_book():
    print("Building Jupyter Book...")
    subprocess.run(["jupyter-book", "build", "--all", "."])
    print("Jupyter Book build complete.")

if __name__ == "__main__":
    server = Server()
    server.watch("_static/**", build_book)
    server.watch("**/*.md", build_book)  # Watch for Markdown files
    server.watch("**/*.png", build_book) # Watch for notebooks
    server.watch("*.md", build_book) # Watch for config
    server.watch("_config.yml", build_book) # Watch for config
    server.watch("_toc.yml", build_book) # Watch for config
    server.serve(root="_build/html")
