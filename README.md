# OUIJ-AI 🔮

An AI-powered Ouija board web experience combining mystical aesthetics with cutting-edge AI technology. Ask questions and watch as AI spirits respond through smooth planchette animations.

![OUIJ-AI Banner](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue) ![Vite](https://img.shields.io/badge/Vite-6.0-purple) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.0-cyan)

## ✨ Features

- **AI-Powered Responses**: Powered by Anthropic's Claude Sonnet 4 for cryptic, mysterious responses
- **Smooth Animations**: 60fps planchette animations using requestAnimationFrame with bezier curves
- **Real-time Streaming**: Server-Sent Events (SSE) for live AI responses
- **Spirit Name Verification**: AI verifies if the spirit you're contacting is a deceased individual
- **Voice Input**: Speak your questions using the Web Speech API (Chrome, Safari, Edge)
- **Text Input**: Type questions directly and press Enter to submit
- **Session Persistence**: Automatically restores your séance for 5 minutes after page refresh
- **Conversation History**: Track your full dialogue with the spirits
- **Spooky Effects**: Zalgo text effects and atmospheric styling

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- Anthropic API key ([get one here](https://console.anthropic.com/))

### Installation

```bash
# Clone the repository
git clone https://github.com/evgenyvinnik/ouij-ai.git
cd ouij-ai

# Install dependencies
bun install

# Create environment file
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

### Development

```bash
# Start dev server
bun run dev

# Open http://localhost:3000
```

### Build

```bash
# Build for production
bun run build

# Preview production build
bun run preview
```

## 🎮 How to Use

1. **Enter a Spirit Name**: When prompted, enter the name of the spirit you wish to contact
2. **Ask Your Question**:
   - Type your question using the keyboard and press Enter, OR
   - Click the microphone button and speak your question (Chrome/Safari/Edge)
3. **Watch the Magic**: The planchette will autonomously move to spell out the AI's cryptic response
4. **Continue the Conversation**: Ask follow-up questions to dig deeper into the mysteries
5. **Session Persistence**: Refresh the page within 5 minutes to continue your séance

## 🏗️ Tech Stack

- **Frontend Framework**: React 19 with React Compiler
- **Build Tool**: Vite 6
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **State Management**:
  - Zustand for client state
  - TanStack Query for server state
- **AI Backend**: Anthropic Claude API via Vercel Edge Functions
- **Deployment**: Vercel

## 📁 Project Structure

```
ouij-ai/
├── api/                    # Vercel Edge Functions
│   ├── chat.ts            # Main AI chat endpoint with SSE
│   ├── constants.ts       # AI configuration and prompts
│   └── utils.ts           # Server utilities
├── src/
│   ├── components/
│   │   ├── board/         # Ouija board components
│   │   ├── ui/            # Reusable UI components
│   │   └── chat/          # Chat panel components
│   ├── hooks/             # Custom React hooks
│   ├── state/             # Zustand store
│   ├── types/             # TypeScript types
│   ├── utils/             # Utilities (animations, zalgo, coords)
│   └── api/               # API client
├── public/                # Static assets
│   ├── robots.txt         # Search engine crawler rules
│   └── sitemap.xml        # SEO sitemap
└── docs/                  # Documentation
```

## 🔍 SEO Optimization

OUIJ-AI is fully optimized for search engines and social media sharing:

### Meta Tags
- **Primary SEO**: Title, description, keywords optimized for "AI Ouija board" searches
- **Open Graph**: Rich previews for Facebook, LinkedIn, and other social platforms
- **Twitter Cards**: Beautiful card previews when shared on Twitter/X
- **Canonical URLs**: Prevent duplicate content issues

### Structured Data
- **JSON-LD Schema**: WebApplication schema for rich search results
- **Feature Lists**: Highlights key app capabilities for search engines
- **Ratings**: Aggregate rating display in search results

### Search Engine Files
- **robots.txt**: Allows all crawlers, blocks API endpoints
- **sitemap.xml**: Helps search engines discover and index pages
- **Canonical tags**: Single source of truth for page URLs

### Social Media Preview Images
To complete SEO setup, add these images to `/public/`:
- `og-image.png` (1200x630px) - For Open Graph/Facebook
- `twitter-image.png` (1200x600px) - For Twitter cards
- `screenshot.png` (any size) - App screenshot for schema.org

**Generate screenshots easily:**
1. Navigate to `http://localhost:3000/#preview` in your browser
2. Take a screenshot and crop to required dimensions
3. See [PREVIEW_IMAGES.md](./PREVIEW_IMAGES.md) for detailed instructions

### Testing Your SEO
- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/

## 🎨 Key Features Explained

### Planchette Animation System

The planchette uses requestAnimationFrame for smooth 60fps animations:
1. AI returns letters via the `spell_message` tool
2. Letters are queued in Zustand store
3. `usePlanchetteAnimation` hook processes the queue
4. Each letter: animate to coordinates → pause → reveal → next
5. Easing function (ease-out cubic) creates supernatural feel

### AI Integration

The system uses Anthropic's Claude with a custom tool definition:
- **Tool**: `spell_message` - Forces AI to spell messages letter by letter
- **System Prompt**: Defines spirit personality (cryptic, mysterious, brief)
- **Streaming**: Real-time SSE for responsive experience
- **Context**: Maintains conversation history for coherent dialogue

### Letter Coordinates

Coordinate system ported from [baobabKoodaa/ouija](https://github.com/baobabKoodaa/ouija):
- Pixel-based coordinates relative to board center
- Supports A-Z, 0-9, and special positions (YES, NO, GOODBYE)
- Converted to percentages for responsive CSS positioning

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
bun add -g vercel

# Deploy
vercel

# Set environment variable
vercel env add ANTHROPIC_API_KEY
```

The `vercel.json` configuration is already set up for Edge Functions.

### Environment Variables

Required environment variables:
- `ANTHROPIC_API_KEY`: Your Anthropic API key

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

### Original Project
- **Design and Implementation**: [baobabKoodaa/ouija](https://github.com/baobabKoodaa/ouija) - Original Ouija board design and concept by Baobab Koodaa

### Assets and Effects

- **Ouija Board Image**: Photograph of the original 1889 Ouija board created by Kennard Novelty Company. According to [Wikipedia](https://en.wikipedia.org/wiki/Ouija#/media/File:Ouija_board_-_Kennard_Novelty_Company.png), this image is in the public domain. Photographer unknown.

- **Planchette PNG**: From [KindPNG](https://www.kindpng.com/imgv/hToiomo_transparent-planchette-png-ouija-board-planchette-png-png/), permitted for "non-commercial or personal projects". Author unknown.

- **Smoke Effect**: Tooltip smoke effect adapted from work by [chokcoco](https://segmentfault.com/a/1190000041189786/en). Modified heavily for smoother transitions using SVG animate (not CSS) combined with CSS transitions for dissipation and hover effects.

- **Text Glitch Effects**:
  - TikTok-style glitch effect popularized by TikTok, implementation adapted from [AmazingCSS](https://amazingcss.com/glitch-text-effect-like-tiktok/)
  - Zalgo text inspired by [the legendary Stack Overflow answer](https://stackoverflow.com/questions/1732348/regex-match-open-tags-except-xhtml-self-contained-tags), implementation adapted from [tchouky](https://eeemo.net/) and [The Great Rambler](https://github.com/TheGreatRambler/another-zalgo.js/)

- **Magnifying Glass Effect**: Adapted from [W3Schools](https://www.w3schools.com/howto/howto_js_image_magnifier_glass.asp) example code

- **Fonts**:
  - **Feral**: Created by Marcus Lien Gundersen, downloaded from [1001fonts](https://www.1001fonts.com/feral-font.html) - personal and commercial use permitted
  - **Carnivalee Freakshow**: Created by Chris Hansen, downloaded from [1001fonts](https://www.1001fonts.com/carnivalee-freakshow-font.html) - personal and commercial use permitted
  - **Kingthings Trypewriter 2**: Created by Kevin King, downloaded from [1001fonts](https://www.1001fonts.com/kingthings-trypewriter-2-font.html) - personal and commercial use permitted

- **Background Pattern**: From [Hero Patterns](https://heropatterns.com/), used under CC BY 4.0 license

- **Icons**: Settings and external link icons from [FontAwesome](https://fontawesome.com/icons/gear?s=solid) - personal and commercial use permitted

- **Images**:
  - Easter egg vintage photo from [Vintage Everyday](https://www.vintag.es/2016/11/these-50-creepy-photographs-early-20th.html) - copyright expired
  - Glass crack PNG from [SeekPNG](https://www.seekpng.com/ipng/u2q8i1y3r5i1t4a9_the-gallery-for-broken-glass-transparent-png-broken/) - personal use permitted

### Technology & Architecture
- **Architecture Patterns**: Inspired by [evgenyvinnik/MCPlator](https://github.com/evgenyvinnik/MCPlator)
- **AI Technology**: Powered by [Anthropic Claude](https://www.anthropic.com/)
- **Framework**: [React 19](https://react.dev/) with React Compiler
- **Build Tool**: [Vite 6](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)

### Special Thanks
- Baobab Koodaa for the original Ouija board implementation and visual design
- Anthropic for the Claude AI API
- All open-source contributors whose work made this project possible

## 📞 Support

For issues, questions, or suggestions, please [open an issue](https://github.com/evgenyvinnik/ouij-ai/issues).

---

**Note**: This is a creative project for entertainment purposes. The "spirits" are powered by AI language models. 👻
