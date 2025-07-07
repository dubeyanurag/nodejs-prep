# Node.js Interview Preparation Site

A comprehensive static course site for backend engineering interview preparation targeting senior developers (5+ years experience).

## Features

- **Comprehensive Coverage**: Complete end-to-end coverage of Node.js, databases (SQL/NoSQL), system design, DevOps, and object-oriented design
- **Interactive Learning**: Flashcards, Q&A sections, and practical code examples
- **Visual Learning**: System diagrams, flowcharts, and architecture blueprints using Mermaid.js
- **Search Functionality**: Full-text search across all content using Fuse.js
- **Static Export**: Optimized for static hosting with Next.js static export

## Technology Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **Code Highlighting**: Prism.js
- **Diagrams**: Mermaid.js
- **Search**: Fuse.js
- **Build**: Static export for optimal performance

## Project Structure

```
nodejs-interview-prep/
├── src/
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components
│   │   ├── layout/         # Layout components
│   │   └── content/        # Content-specific components
│   ├── lib/                # Utility libraries
│   │   ├── prism.ts        # Code highlighting setup
│   │   ├── mermaid.ts      # Diagram rendering
│   │   ├── search.ts       # Search functionality
│   │   └── utils.ts        # General utilities
│   └── types/              # TypeScript type definitions
├── content/                # Educational content
│   ├── topics/            # Topic content by category
│   ├── questions/         # Interview questions
│   ├── examples/          # Code examples
│   ├── diagrams/          # Mermaid diagram definitions
│   └── flashcards/        # Flashcard content
└── public/                # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Building for Production

Build the static site:
```bash
npm run build
```

The static files will be generated in the `out/` directory.

### Serving Static Build

To serve the static build locally:
```bash
npm run serve
```

## Deployment

This site is configured for deployment to GitHub Pages using GitHub Actions.

### Quick Setup

Run the setup script to configure deployment:

```bash
./scripts/setup-deployment.sh
```

This will:
- Configure your repository URLs
- Test the build process
- Set up the correct branch
- Push your changes

### Manual Setup

1. **Enable GitHub Pages**:
   - Go to repository Settings > Pages
   - Set Source to "GitHub Actions"

2. **Deploy**:
   ```bash
   git push origin main
   ```

3. **Access your site**:
   - Available at `https://[username].github.io/[repository-name]`

### Local Testing

```bash
# Build and test locally
npm run build
npm run serve
```

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## Content Management

All educational content is stored in the `content/` directory as Markdown files with frontmatter metadata. The content is organized by:

- **Topics**: Individual topic content organized by category
- **Questions**: Interview questions with detailed answers
- **Examples**: Code examples and implementations
- **Diagrams**: Mermaid diagram definitions
- **Flashcards**: Interactive flashcard content

## Dependencies

### Core Dependencies
- `next`: React framework with static export capability
- `react` & `react-dom`: React library
- `typescript`: TypeScript support

### Styling
- `tailwindcss`: Utility-first CSS framework
- `clsx` & `tailwind-merge`: Conditional class utilities

### Content Processing
- `prismjs`: Syntax highlighting for code examples
- `mermaid`: Diagram and flowchart rendering
- `fuse.js`: Client-side fuzzy search

## Development Status

This project is currently under active development. The foundation and core structure have been established, with content and features being added incrementally.

## License

This project is for educational purposes.