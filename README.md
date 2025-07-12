# Venice.ai Image Generator

A comprehensive web application for generating high-quality images using the Venice.ai API, enhanced with AI-powered prompt optimization through Google Gemini 2.5.

![Venice.ai Generator](https://img.shields.io/badge/Venice.ai-Image%20Generator-purple?style=for-the-badge) ![Version](https://img.shields.io/badge/Version-2.0-blue?style=for-the-badge) ![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## 🎨 Features

### ✨ Core Image Generation
- **Multiple Image Generation**: Generate 1-4 images simultaneously with varied seeds
- **Venice.ai Model Support**: Compatible with Venice.ai's latest image generation models
- **Advanced Parameters**: Full control over steps, CFG scale, seeds, and aspect ratios
- **15 Style Presets**: Complete collection of Venice.ai artistic styles
- **Multiple Output Formats**: PNG, JPG, WEBP support
- **Auto-Upscaling**: Optional 2x upscaling with enhancement

### 🤖 AI-Powered Prompt Enhancement
- **Google Gemini 2.5 Integration**: Natural language prompt optimization
- **Intelligent Prompt Engineering**: Transform simple descriptions into detailed prompts
- **Automatic Form Population**: AI suggestions applied directly to generation parameters
- **Negative Prompt Suggestions**: Smart recommendations for what to avoid
- **Technical Optimization**: AI-recommended steps, CFG scale, and style settings

### 🔧 Advanced API Management
- **Dual API Key Support**: Primary and fallback keys for both Venice.ai and Gemini
- **Automatic Fallback**: Seamless switching to backup keys on failure
- **Persistent Storage**: API keys securely stored in localStorage
- **Error Handling**: Comprehensive error messages and retry logic

### 🎯 User Experience
- **Dracula Theme**: Beautiful dark theme with Venice.ai purple accents
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Hover Action Menus**: Context-sensitive actions for each generated image
- **Toast Notifications**: Real-time feedback for all operations
- **Generation History**: Persistent history with thumbnails and metadata

### 📱 Interactive Features
- **Image Actions**: Download, upscale, save to history, regenerate
- **History Management**: Load previous generations, delete items, clear all
- **Tab Navigation**: Organized interface with History and AI Assistant tabs
- **Modal Assistant**: Dedicated AI chat interface for prompt optimization
- **Real-time Updates**: Live parameter display and instant feedback

## 🚀 Getting Started

### Prerequisites
- **Venice.ai API Key**: Sign up at [Venice.ai](https://venice.ai) for image generation
- **Google Gemini API Key**: Get your key from [Google AI Studio](https://aistudio.google.com) for AI assistance
- **Modern Web Browser**: Chrome, Firefox, Safari, or Edge

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/Fayeblade1488/venice-ai-generator.git
cd venice-ai-generator
```

2. **Open the application**:
   - Simply open `index.html` in your web browser
   - Or serve it using a local web server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

3. **Configure API Keys**:
   - Enter your Venice.ai API key in the primary key field
   - Enter your Google Gemini API key for AI assistance
   - Optionally add fallback keys for redundancy
   - Keys are automatically saved to localStorage

## 📖 Usage Guide

### Basic Image Generation

1. **Enter your prompt** in the main text area
2. **Configure parameters**:
   - Choose model, steps, CFG scale
   - Select aspect ratio and style preset
   - Set number of images (1-4)
3. **Click "Generate Images"** and wait for results
4. **Interact with generated images**:
   - Click any image to open the action menu
   - Download, upscale, save to history, or regenerate

### AI-Powered Prompt Enhancement

1. **Click "AI Prompt Assistant"** to open the modal
2. **Describe your vision** in natural language
3. **Click "Generate Prompt"** to get AI optimization
4. **Settings are automatically applied** to the form
5. **Generate images** with the enhanced prompt

### Advanced Features

- **Batch Generation**: Generate multiple variations with different seeds
- **Auto-Upscaling**: Enable automatic 2x upscaling for all generated images
- **History Management**: Access, download, and reload previous generations
- **Fallback API Keys**: Ensure uninterrupted service with backup keys

## 🛠️ Configuration

### API Settings
- **Venice.ai API**: Used for image generation and upscaling
- **Google Gemini API**: Powers the AI prompt optimization assistant
- **Fallback Keys**: Automatic failover for enhanced reliability

### Generation Parameters
- **Models**: Choose from available Venice.ai models
- **Steps**: 1-50 (recommended: 20-30 for quality)
- **CFG Scale**: 1-20 (recommended: 6-8 for most cases)
- **Aspect Ratios**: Square (1:1), Tall (3:4), Wide (4:3)
- **Styles**: 15 artistic presets including Anime, Photorealistic, Abstract, etc.

### Quality Settings
- **Safe Mode**: Content filtering (default: enabled)
- **Hide Watermark**: Remove Venice.ai branding
- **Auto-Upscale**: Automatic 2x enhancement
- **Output Format**: PNG, JPG, WEBP support

## 🎨 Style Presets

The application includes 15 carefully curated style presets:

- **photorealistic**: Ultra-realistic photography style
- **anime**: Japanese animation aesthetic
- **digital-art**: Modern digital artwork
- **fantasy-art**: Magical and fantastical themes
- **abstract**: Non-representational artistic expression
- **portrait**: Human subject focus
- **landscape**: Natural scenery emphasis
- **sci-fi**: Science fiction themes
- **horror**: Dark and atmospheric
- **vintage**: Retro and classic aesthetics
- **minimalist**: Clean and simple design
- **cyberpunk**: Futuristic dystopian style
- **watercolor**: Traditional painting technique
- **oil-painting**: Classical art medium
- **sketch**: Hand-drawn appearance

## 🧩 Technical Architecture

### Frontend
- **HTML5**: Semantic structure with accessibility features
- **CSS3**: Custom properties, Flexbox, Grid, animations
- **Vanilla JavaScript**: ES6+ with async/await patterns
- **localStorage**: Client-side persistence for keys and history

### API Integration
- **Venice.ai REST API**: Image generation and upscaling endpoints
- **Google Gemini API**: Natural language processing and prompt enhancement
- **Fetch API**: Modern HTTP client with comprehensive error handling
- **Blob Handling**: Efficient image data management

### Design System
- **Dracula Color Palette**: Professional dark theme
- **Venice.ai Purple Accents**: Brand-consistent highlighting
- **Responsive Typography**: Optimized for all screen sizes
- **Micro-interactions**: Smooth animations and transitions

## 🔒 Privacy & Security

- **Local Storage Only**: API keys stored securely in browser localStorage
- **No Data Transmission**: Keys never sent to third parties
- **Client-Side Processing**: All operations performed in your browser
- **HTTPS Ready**: Secure connections to all APIs

## 📱 Browser Compatibility

- **Chrome**: 88+ (recommended)
- **Firefox**: 85+
- **Safari**: 14+
- **Edge**: 88+

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Faye Håkansdotter**
- GitHub: [@Fayeblade1488](https://github.com/Fayeblade1488)
- Email: swings.toccata_3h@icloud.com

## 🙏 Acknowledgments

- **Venice.ai** for providing the powerful image generation API
- **Google** for the Gemini AI that powers our prompt enhancement
- **Dracula Theme** for the beautiful color palette
- **The Open Source Community** for inspiration and best practices

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/Fayeblade1488/venice-ai-generator/issues) page
2. Create a new issue with detailed information
3. Include browser version, error messages, and steps to reproduce

## 🔮 Roadmap

- **Image Editing**: Basic editing tools for generated images
- **Batch Processing**: Queue system for multiple generation requests
- **Template System**: Save and reuse generation configurations
- **Image Variations**: Generate variations of existing images
- **Social Sharing**: Direct sharing to social platforms
- **Export Options**: Bulk download and organization features

---

*Built with ❤️ for the creative community*