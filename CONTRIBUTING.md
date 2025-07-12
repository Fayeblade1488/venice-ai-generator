# Contributing to Venice.ai Generator

Thank you for your interest in contributing to the Venice.ai Generator! This document provides guidelines and information for contributors.

## 🎯 How to Contribute

### Reporting Issues

1. **Check existing issues** first to avoid duplicates
2. **Use the issue template** when creating new issues
3. **Provide detailed information**:
   - Browser version and OS
   - Steps to reproduce the issue
   - Expected vs actual behavior
   - Screenshots if applicable
   - Console error messages

### Suggesting Features

1. **Open a discussion** before starting work on major features
2. **Describe the use case** and benefit to users
3. **Consider the scope** - keep features focused and well-defined
4. **Check the roadmap** to avoid conflicting with planned features

### Code Contributions

#### Getting Started

1. **Fork the repository** to your GitHub account
2. **Clone your fork** locally:
```bash
git clone https://github.com/your-username/venice-ai-generator.git
cd venice-ai-generator
```

3. **Create a feature branch**:
```bash
git checkout -b feature/your-feature-name
```

#### Development Guidelines

##### Code Style

- **Use consistent formatting**:
  - 4 spaces for indentation
  - Semicolons required
  - Single quotes for strings
  - Trailing commas in multiline objects/arrays

- **Follow naming conventions**:
  - `camelCase` for variables and functions
  - `PascalCase` for classes and constructors
  - `UPPER_CASE` for constants
  - Descriptive names that explain purpose

- **Comment your code**:
  - Document complex logic
  - Explain API interactions
  - Use JSDoc for functions when appropriate

##### HTML/CSS Guidelines

- **Semantic HTML**: Use appropriate HTML5 elements
- **Accessibility**: Include ARIA labels and proper focus management
- **CSS Variables**: Use CSS custom properties for consistent theming
- **Responsive Design**: Test on multiple screen sizes
- **Browser Compatibility**: Ensure compatibility with target browsers

##### JavaScript Guidelines

- **Modern ES6+**: Use modern JavaScript features appropriately
- **Async/Await**: Prefer async/await over Promise chains
- **Error Handling**: Implement comprehensive error handling
- **Performance**: Optimize for performance, especially image handling
- **Security**: Sanitize user inputs and validate API responses

#### Testing Your Changes

1. **Manual Testing**:
   - Test core functionality (image generation, AI assistant)
   - Verify responsive design on different screen sizes
   - Test with both API keys and fallback scenarios
   - Validate error handling and edge cases

2. **Browser Testing**:
   - Chrome (latest)
   - Firefox (latest)
   - Safari (latest)
   - Edge (latest)

3. **Performance Testing**:
   - Test with multiple image generations
   - Verify memory usage doesn't grow excessively
   - Check load times and responsiveness

#### Submitting Changes

1. **Commit your changes** with clear messages:
```bash
git add .
git commit -m "feat: add image batch processing feature"
```

2. **Push to your fork**:
```bash
git push origin feature/your-feature-name
```

3. **Create a Pull Request**:
   - Use the PR template
   - Provide a clear description of changes
   - Link any related issues
   - Include screenshots for UI changes

## 📋 Pull Request Guidelines

### PR Requirements

- **Clear title** describing the change
- **Detailed description** of what was changed and why
- **Link to related issues** using `Fixes #123` or `Closes #123`
- **Screenshots or GIFs** for UI changes
- **Updated documentation** if applicable

### PR Process

1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Testing** verification
4. **Approval** and merge

### Review Criteria

- **Functionality**: Does it work as intended?
- **Code Quality**: Is it well-written and maintainable?
- **Performance**: Does it impact app performance?
- **Security**: Are there any security concerns?
- **Documentation**: Is it properly documented?

## 🚀 Development Setup

### Local Development

1. **No build process required** - this is a pure HTML/CSS/JS app
2. **Use a local server** for development:
```bash
# Python
python -m http.server 8000

# Node.js
npx serve

# PHP
php -S localhost:8000
```

3. **API Keys**: You'll need:
   - Venice.ai API key for testing image generation
   - Google Gemini API key for testing AI features

### File Structure

```
venice-ai-generator/
├── index.html          # Main application file
├── styles.css          # Dracula-themed styles
├── script.js          # Application logic
├── README.md          # Project documentation
├── CONTRIBUTING.md    # This file
├── LICENSE           # MIT license
└── package.json      # Project metadata
```

## 🎨 Design Guidelines

### Color Palette (Dracula Theme)

- Background: `#282a36`
- Current Line: `#44475a`
- Foreground: `#f8f8f2`
- Comment: `#6272a4`
- Cyan: `#8be9fd`
- Green: `#50fa7b`
- Orange: `#ffb86c`
- Pink: `#ff79c6`
- Purple: `#bd93f9`
- Red: `#ff5555`
- Yellow: `#f1fa8c`

### Venice.ai Accents

- Primary Purple: `#6366f1`
- Secondary Purple: `#8b5cf6`
- Hover Purple: `#7c3aed`

### UI Principles

- **Consistency**: Maintain consistent spacing, colors, and typography
- **Accessibility**: Ensure good contrast ratios and keyboard navigation
- **Responsiveness**: Design for mobile-first, progressive enhancement
- **Performance**: Optimize images and animations for smooth experience

## 🔧 API Integration Guidelines

### Venice.ai API

- **Rate Limiting**: Respect API rate limits
- **Error Handling**: Handle all possible error responses
- **Fallback Support**: Always support fallback API keys
- **Security**: Never expose API keys in client-side code

### Google Gemini API

- **Prompt Engineering**: Use consistent system prompts
- **Safety Settings**: Configure appropriate safety filters
- **Response Parsing**: Robust parsing of AI responses
- **Token Management**: Monitor token usage and limits

## 📝 Documentation Standards

### Code Documentation

- **Inline comments** for complex logic
- **Function documentation** using JSDoc format
- **API documentation** for any new endpoints
- **README updates** for new features

### User Documentation

- **Feature explanations** in README.md
- **Usage examples** with screenshots
- **Troubleshooting guides** for common issues
- **Configuration instructions** for setup

## 🐛 Bug Fix Guidelines

### Priority Levels

1. **Critical**: App crashes, security issues, data loss
2. **High**: Major features broken, API failures
3. **Medium**: Minor features affected, UI issues
4. **Low**: Cosmetic issues, nice-to-have improvements

### Bug Fix Process

1. **Reproduce the issue** locally
2. **Identify root cause** through debugging
3. **Implement minimal fix** that addresses the root cause
4. **Test thoroughly** to ensure no regression
5. **Update tests** if applicable

## 🌟 Feature Development

### New Feature Checklist

- [ ] **Design consideration**: Does it fit the app's purpose?
- [ ] **User experience**: Is it intuitive and helpful?
- [ ] **Performance impact**: Does it affect app speed?
- [ ] **Mobile compatibility**: Works on all screen sizes?
- [ ] **Error handling**: Graceful failure scenarios?
- [ ] **Documentation**: README and code comments updated?
- [ ] **Testing**: Manually tested across browsers?

## 💬 Community Guidelines

### Communication

- **Be respectful** and constructive in all interactions
- **Ask questions** if you're unsure about anything
- **Share knowledge** and help other contributors
- **Follow the code of conduct** in all communications

### Getting Help

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Pull Request Comments**: For code-specific questions

## 🎉 Recognition

Contributors will be recognized in:
- **README.md** acknowledgments section
- **GitHub contributor graph**
- **Release notes** for significant contributions

Thank you for contributing to the Venice.ai Generator! 🚀