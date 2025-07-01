# Static Page Generator

A powerful static site generator that creates PHP files from JSON content using Handlebars templates. This tool generates fully functional PHP websites with form processing, dynamic content, and optimization features.

## ✨ Features

- **JSON-driven content**: Define your site content in simple JSON files
- **Handlebars templating**: Powerful template engine with custom helpers
- **PHP form processing**: Automatic generation of contact and brochure forms
- **SEO optimization**: Meta tags, Open Graph, Twitter Cards, and sitemaps
- **Build optimization**: Minification, compression, and performance optimization
- **Development tools**: Watch mode, validation, and error handling
- **Security features**: CSRF protection, input sanitization, and validation

## 🚀 Quick Start

### Prerequisites

- Node.js 14.0.0 or higher
- PHP 7.4 or higher (for form processing)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd static-page-gen
```

2. Install dependencies:
```bash
npm install
```

3. Generate your first site:
```bash
npm run build content/london.json
```

4. Start the development server:
```bash
npm run serve
```

## 📁 Project Structure

```
static-page-gen/
├── content/                 # JSON content files
│   ├── london.json
│   ├── bank.json
│   └── template.json
├── template/               # Handlebars templates
│   └── base.hbs
├── build/                  # Generated PHP files
│   ├── london.php
│   ├── bank.php
│   ├── contact-form.php
│   ├── brochure-form.php
│   ├── config.php
│   ├── includes.php
│   └── sitemap.xml
├── scripts/               # Build scripts
│   └── optimize.js
├── generate.js            # Main generator
└── package.json
```

## 📝 Content Structure

Your JSON content files should follow this structure:

```json
{
  "site": {
    "title": "Your Site Title",
    "brandName": "Your Brand",
    "url": "https://yoursite.com",
    "favicon32": "/favicon-32x32.png",
    "favicon16": "/favicon-16x16.png",
    "appleTouchIcon": "/apple-touch-icon.png",
    "webmanifest": "/site.webmanifest",
    "ogImage": "/og-image.jpg"
  },
  "page": {
    "title": "Page Title",
    "description": "Page description for SEO",
    "keywords": "keyword1, keyword2, keyword3"
  },
  "navigation": {
    "links": [
      {
        "text": "Home",
        "href": "/"
      }
    ],
    "callButton": {
      "text": "Call Us"
    },
    "quoteButton": {
      "text": "Get Quote"
    }
  },
  "hero": {
    "slides": [
      {
        "image": "assets/img/slide1.jpg"
      }
    ],
    "title": {
      "line1": "Your Main",
      "accent": "Headline"
    },
    "description": "Your hero description",
    "primaryButton": {
      "text": "Get Started",
      "href": "#contact"
    },
    "secondaryButton": {
      "text": "Learn More",
      "href": "#about"
    }
  },
  "contact": {
    "email": "info@yoursite.com",
    "phone": "+44 123 456 7890"
  }
}
```

## 🛠️ Available Scripts

### Build Commands

```bash
# Build a single page
npm run build content/london.json

# Build all pages
npm run build:all

# Clean build directory
npm run clean

# Build with watch mode (development)
npm run dev
```

### Development Commands

```bash
# Start PHP development server
npm run serve

# Validate JavaScript syntax
npm run validate

# Lint code
npm run lint

# Format code
npm run format
```

### Optimization Commands

```bash
# Optimize build files
npm run optimize

# Build and optimize for production
npm run deploy
```

## 🔧 PHP Features

### Form Processing

The generator automatically creates PHP form handlers for:

- **Contact forms**: `contact-form.php`
- **Brochure forms**: `brochure-form.php`

These handlers include:
- Input validation and sanitization
- Email sending functionality
- CSRF protection
- Error handling
- JSON responses for AJAX requests

### Configuration

The `config.php` file provides:
- Site configuration constants
- Security settings
- Email configuration
- Utility functions
- Error handling

### Utility Functions

The `includes.php` file includes:
- Page metadata generation
- Breadcrumb generation
- Social sharing buttons
- FAQ sections
- Testimonials
- Contact information
- CTA sections

## 🎨 Template Helpers

### Built-in Helpers

- `{{add a b}}`: Add two numbers
- `{{times n block}}`: Repeat a block n times
- `{{formatDate date}}`: Format dates
- `{{capitalize str}}`: Capitalize first letter
- `{{truncate str length}}`: Truncate text

### Custom Helpers

You can add custom helpers in `generate.js`:

```javascript
handlebars.registerHelper('customHelper', function(param) {
    return 'Custom logic here';
});
```

## 🔒 Security Features

### Form Security

- CSRF token generation and validation
- Input sanitization and validation
- Email validation
- Rate limiting (configurable)
- SQL injection prevention

### General Security

- Security headers
- XSS protection
- Content type validation
- File upload restrictions
- Error handling without information disclosure

## 📊 SEO Features

### Meta Tags

- Title and description
- Keywords
- Open Graph tags
- Twitter Card tags
- Canonical URLs

### Sitemap Generation

Automatic generation of `sitemap.xml` with:
- Page URLs
- Last modified dates
- Change frequency
- Priority settings

### Robots.txt

Automatic generation of `robots.txt` with:
- Allow/disallow rules
- Sitemap reference

## 🚀 Performance Optimization

### Build Optimization

- HTML minification
- CSS minification
- JavaScript minification
- Image optimization (configurable)
- Gzip compression ready

### Caching

- Static file caching headers
- Browser caching configuration
- ETag support

## 🔧 Configuration

### Email Configuration

Update `config.php` with your email settings:

```php
define('SMTP_HOST', 'your-smtp-host');
define('SMTP_PORT', 587);
define('SMTP_USERNAME', 'your-username');
define('SMTP_PASSWORD', 'your-password');
```

### Security Configuration

```php
define('CSRF_TOKEN_NAME', 'csrf_token');
define('MAX_FILE_SIZE', 5 * 1024 * 1024); // 5MB
define('ALLOWED_FILE_TYPES', ['jpg', 'jpeg', 'png', 'gif', 'pdf']);
```

## 🐛 Troubleshooting

### Common Issues

1. **Form not sending emails**
   - Check SMTP configuration in `config.php`
   - Verify PHP mail() function is enabled
   - Check server logs for errors

2. **Template errors**
   - Validate JSON syntax
   - Check for missing required fields
   - Verify Handlebars syntax

3. **Build errors**
   - Ensure Node.js version is 14+ 
   - Check file permissions
   - Verify all dependencies are installed

### Debug Mode

Enable debug mode by setting in `config.php`:

```php
define('DEVELOPMENT_MODE', true);
```

## 📈 Advanced Usage

### Custom Templates

Create custom templates by:
1. Adding new `.hbs` files in the `template/` directory
2. Modifying `generate.js` to use different templates
3. Creating template-specific JSON schemas

### Multiple Sites

Generate multiple sites by:
1. Creating separate content directories
2. Using different template sets
3. Running the generator for each site

### Deployment

For production deployment:
1. Run `npm run deploy` for optimized build
2. Upload `build/` directory to your web server
3. Configure web server for PHP
4. Set up email configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Check the troubleshooting section
- Review the configuration examples
- Open an issue on GitHub

---

**Happy coding! 🎉**
