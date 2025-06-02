# GPT-Engineer Web Platform

A modern web platform for GPT-Engineer, enabling visual composition of AI agents through a user-friendly interface.

## Features

- Visual workflow editor for building AI agents
- Real-time code generation and deployment
- Project management and version control
- Team collaboration features
- Integrated chat interface for AI interaction
- Deployment management and monitoring

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **Code Editor**: Monaco Editor
- **State Management**: Zustand

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/gpt-engineer-web.git
   cd gpt-engineer-web
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
web/
├── src/
│   ├── components/     # React components
│   ├── pages/         # Next.js pages
│   ├── services/      # API and service functions
│   ├── styles/        # Global styles
│   └── types/         # TypeScript type definitions
├── public/            # Static assets
└── ...config files
```

## Development

### Code Style

- Follow the TypeScript and React best practices
- Use functional components with hooks
- Implement proper error handling
- Write meaningful comments and documentation

### Testing

```bash
npm run test
# or
yarn test
```

### Building for Production

```bash
npm run build
# or
yarn build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- GPT-Engineer team for the original CLI tool
- Next.js team for the amazing framework
- Supabase team for the backend infrastructure 