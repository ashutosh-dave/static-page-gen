const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

// Register the 'add' helper
handlebars.registerHelper('add', function(a, b) {
    return a + b;
});

// Register the 'times' helper
handlebars.registerHelper('times', function(n, block) {
    let accum = '';
    for (let i = 0; i < n; ++i) {
        accum += block.fn(i);
    }
    return accum;
});

// Register the 'formatDate' helper
handlebars.registerHelper('formatDate', function(date) {
    return new Date(date).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
});

// Register the 'capitalize' helper
handlebars.registerHelper('capitalize', function(str) {
    if (typeof str !== 'string') return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
});

// Register the 'truncate' helper
handlebars.registerHelper('truncate', function(str, length) {
    if (typeof str !== 'string') return str;
    if (str.length <= length) return str;
    return str.substring(0, length) + '...';
});

// Register the 'eq' helper for equality checking
handlebars.registerHelper('eq', function(a, b) {
    return a === b;
});

// Register the 'add' helper for arithmetic
handlebars.registerHelper('add', function(a, b) {
    return a + b;
});

// Register the 'times' helper for loops
handlebars.registerHelper('times', function(n, block) {
    let result = '';
    for (let i = 0; i < n; i++) {
        result += block.fn(i);
    }
    return result;
});

// Register partials
handlebars.registerPartial('header', fs.readFileSync('template/partials/header.hbs', 'utf8'));
handlebars.registerPartial('footer', fs.readFileSync('template/partials/footer.hbs', 'utf8'));

// Validate input arguments
function validateInput() {
    const inputPath = process.argv[2];
    if (!inputPath) {
        console.error("❌ Error: No input file specified");
        console.error("Usage: node generate.js <content-file.json>");
        console.error("Example: node generate.js content/london.json");
        process.exit(1);
    }

    if (!fs.existsSync(inputPath)) {
        console.error(`❌ Error: Input file not found: ${inputPath}`);
        process.exit(1);
    }

    return inputPath;
}

// Validate JSON data structure with fallbacks
function validateData(data) {
    let warnings = [];
    
    // Ensure basic structure exists
    if (!data.site) {
        data.site = {};
        warnings.push('Missing "site" object - using defaults');
    }
    
    if (!data.page) {
        data.page = {};
        warnings.push('Missing "page" object - using defaults');
    }
    
    // Add default values for missing site fields
    if (!data.site.title) data.site.title = 'Website';
    if (!data.site.brandName) data.site.brandName = 'Brand';
    if (!data.site.url) data.site.url = '';
    if (!data.site.homeUrl) data.site.homeUrl = '/';
    
    // Add default values for missing page fields
    if (!data.page.title) data.page.title = 'Page Title';
    if (!data.page.description) data.page.description = 'Page description';
    if (!data.page.keywords) data.page.keywords = '';
    if (!data.page.canonical) data.page.canonical = '/';
    
    // Add default contact info if missing
    if (!data.contact) {
        data.contact = {
            email: 'info@example.com',
            phone: '+1234567890'
        };
        warnings.push('Missing "contact" object - using defaults');
    }
    
    // Add default navigation if missing
    if (!data.navigation) {
        data.navigation = {
            links: [],
            callButton: null,
            quoteButton: null
        };
        warnings.push('Missing "navigation" object - using defaults');
    }
    
    // Display warnings
    if (warnings.length > 0) {
        console.log('⚠️  Data validation warnings:');
        warnings.forEach(warning => {
            console.log(`   ${warning}`);
        });
        console.log('');
    }

    return true;
}

// Create build directory if it doesn't exist
function ensureBuildDirectory() {
    const buildDir = 'build';
    if (!fs.existsSync(buildDir)) {
        fs.mkdirSync(buildDir, { recursive: true });
        console.log(`📁 Created build directory: ${buildDir}`);
    }
}

// Generate form processing PHP files
function generateFormHandlers() {
    const contactFormHandler = `<?php
require_once __DIR__ . '/config.php';
// Contact Form Handler
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.php');
    exit;
}
$response = [
    'success' => false,
    'message' => '',
    'errors' => []
];
try {
    $required_fields = ['name', 'email', 'phone', 'company_name', 'message'];
    $missing_fields = [];
    foreach ($required_fields as $field) {
        if (empty($_POST[$field])) {
            $missing_fields[] = $field;
        }
    }
    if (!empty($missing_fields)) {
        throw new Exception('Please fill in all required fields: ' . implode(', ', $missing_fields));
    }
    if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Please enter a valid email address');
    }
    $name = htmlspecialchars(trim($_POST['name']), ENT_QUOTES, 'UTF-8');
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $phone = htmlspecialchars(trim($_POST['phone']), ENT_QUOTES, 'UTF-8');
    $company = htmlspecialchars(trim($_POST['company_name']), ENT_QUOTES, 'UTF-8');
    $message = htmlspecialchars(trim($_POST['message']), ENT_QUOTES, 'UTF-8');
    $subject = "New Contact Form Submission - " . SITE_NAME;
    $email_content = "\n    New contact form submission received:\n    \n    Name: {$name}\n    Email: {$email}\n    Phone: {$phone}\n    Company: {$company}\n    Message: {$message}\n    \n    Submitted on: " . date('Y-m-d H:i:s') . "\n    IP Address: " . $_SERVER['REMOTE_ADDR'] . "\n    ";
    $to = SITE_EMAIL;
    $headers = "From: {$email}\r\n";
    $headers .= "Reply-To: {$email}\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    if (mail($to, $subject, $email_content, $headers)) {
        $response['success'] = true;
        $response['message'] = 'Thank you for your message. We will get back to you soon!';
    } else {
        throw new Exception('Failed to send email. Please try again later.');
    }
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
}
header('Content-Type: application/json');
echo json_encode($response);
exit;
?>`;

    const brochureFormHandler = `<?php
require_once __DIR__ . '/config.php';
// Brochure Form Handler
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.php');
    exit;
}
$response = [
    'success' => false,
    'message' => '',
    'errors' => []
];
try {
    $required_fields = ['name', 'email'];
    $missing_fields = [];
    foreach ($required_fields as $field) {
        if (empty($_POST[$field])) {
            $missing_fields[] = $field;
        }
    }
    if (!empty($missing_fields)) {
        throw new Exception('Please fill in all required fields: ' . implode(', ', $missing_fields));
    }
    if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Please enter a valid email address');
    }
    $name = htmlspecialchars(trim($_POST['name']), ENT_QUOTES, 'UTF-8');
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $company = htmlspecialchars(trim($_POST['company'] ?? ''), ENT_QUOTES, 'UTF-8');
    $subject = "Brochure Request - " . SITE_NAME;
    $email_content = "\n    New brochure request received:\n    \n    Name: {$name}\n    Email: {$email}\n    Company: {$company}\n    \n    Submitted on: " . date('Y-m-d H:i:s') . "\n    IP Address: " . $_SERVER['REMOTE_ADDR'] . "\n    ";
    $to = SITE_EMAIL;
    $headers = "From: {$email}\r\n";
    $headers .= "Reply-To: {$email}\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    if (mail($to, $subject, $email_content, $headers)) {
        $response['success'] = true;
        $response['message'] = 'Thank you! We will send you the brochure soon.';
    } else {
        throw new Exception('Failed to send email. Please try again later.');
    }
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
}
header('Content-Type: application/json');
echo json_encode($response);
exit;
?>`;

    // Ensure includes directory exists
    const includesDir = 'build/includes';
    if (!fs.existsSync(includesDir)) {
        fs.mkdirSync(includesDir, { recursive: true });
    }
    
    fs.writeFileSync('build/includes/contact-form.php', contactFormHandler);
    fs.writeFileSync('build/includes/brochure-form.php', brochureFormHandler);
    console.log('✅ Generated contact-form.php and brochure-form.php in includes/');
}

// Main generation function
function generateSite(inputPath) {
    try {
        console.log(`🚀 Starting site generation for: ${inputPath}`);
        // Read and parse JSON data
        const rawData = fs.readFileSync(inputPath, 'utf8');
        const context = JSON.parse(rawData);
        // Validate data structure
        validateData(context);
        // Ensure build directory exists
        ensureBuildDirectory();
        // Read and compile template
        const templateFile = fs.readFileSync('template/base.hbs', 'utf8');
        const template = handlebars.compile(templateFile);
        // Generate the main page
        const output = template(context);
        const fileName = path.basename(inputPath, '.json') + '.php';
        const outputPath = `build/${fileName}`;
        fs.writeFileSync(outputPath, output);
        console.log(`✅ Generated ${fileName}`);
        // Generate config.php
        generateConfig(context);
        // Generate sitemap if multiple pages
        generateSitemap(context);
        console.log(`🎉 Site generation completed successfully!`);
        console.log(`📁 Output directory: build/`);
    } catch (error) {
        console.error(`❌ Error during generation: ${error.message}`);
        if (error instanceof SyntaxError) {
            console.error('This appears to be a JSON parsing error. Please check your JSON file format.');
        }
        process.exit(1);
    }
}

// Generate config.php from template
function generateConfig(data) {
    try {
        const configTemplate = fs.readFileSync('template/config.hbs', 'utf8');
        const template = handlebars.compile(configTemplate);
        const output = template(data);
        
        // Ensure includes directory exists
        const includesDir = 'build/includes';
        if (!fs.existsSync(includesDir)) {
            fs.mkdirSync(includesDir, { recursive: true });
        }
        
        fs.writeFileSync('build/includes/config.php', output);
        console.log('✅ Generated config.php in includes/');
    } catch (error) {
        console.warn('⚠️  Could not generate config.php:', error.message);
    }
}

// Generate sitemap
function generateSitemap(data) {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${data.site.url || 'https://example.com'}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
</urlset>`;
    
    fs.writeFileSync('build/sitemap.xml', sitemap);
    console.log('✅ Generated sitemap.xml');
}

// Run the generator
const inputPath = validateInput();
generateSite(inputPath);