# TL;DR.ai Chrome Extension

A Chrome extension that leverages AI to provide quick summaries and analysis of web pages and their comments.

## Features

- **Quick Summarization**: Summarizes any web page content with one click
- **AI-Powered Analysis**: Detects potential bias and provides content analysis
- **Comments Summary**: Aggregates and summarizes comment sections
- **Multi-Model Support**: 
  - Google Gemini (Free)
  - OpenAI GPT-3.5 (Paid)
- **Bilingual Support**: Available in English and Spanish
- **Floating Button**: Easy access through a non-intrusive floating button
- **Modal Interface**: Clean and intuitive popup interface

## Technical Details

### Architecture

The extension consists of several key components:

1. **Content Script** (`content.js`):
   - Injects floating button and modal
   - Handles DOM manipulation
   - Extracts page content and comments
   - Manages communication with popup

2. **Popup Interface** (`popup.js`, `popup.html`):
   - Manages user interface
   - Handles API key configuration
   - Controls language settings
   - Displays results

3. **AI Service** (`ai-service.js`):
   - Manages API communications
   - Handles prompt engineering
   - Processes AI responses
   - Supports multiple AI providers

4. **Storage Management** (`storage-manager.js`):
   - Handles persistent storage
   - Manages API keys
   - Stores language preferences

### Key Technologies

- Chrome Extension Manifest V3
- Chrome Storage API
- Google Gemini API
- OpenAI API
- CSS Modules
- ES6+ JavaScript

### API Integration

The extension supports two AI providers:

1. **Google Gemini**:
   - Free tier available
   - Uses generative language API
   - Maximum context: 30k tokens

2. **OpenAI GPT-3.5**:
   - Paid service
   - Uses chat completion API
   - Maximum context: 4k tokens

### Security Considerations

- API keys are stored securely in Chrome's local storage
- Content script isolation prevents XSS
- CSP implementation for security
- No external dependencies required

### Performance Optimizations

- Lazy loading of AI models
- Content truncation for large pages
- Efficient DOM manipulation
- Debounced API calls
- Cached results when possible

## Installation

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `summarizer_ai` directory

## Configuration

1. Click the extension icon
2. Select your preferred AI model
3. Enter your API key
4. Choose your preferred language
5. Start summarizing web pages!

## Development

To modify or enhance the extension:

1. Clone the repository
2. Make changes to the source files
3. Reload the extension in Chrome
4. Test thoroughly before deployment

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - See LICENSE file for details