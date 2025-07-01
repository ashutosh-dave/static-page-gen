<?php
/**
 * Common Includes and Functions
 * This file provides shared functionality for all generated pages
 */

// Include configuration
require_once __DIR__ . '/config.php';

/**
 * Page-specific functions
 */

/**
 * Get page metadata
 */
function get_page_metadata($page_data) {
    return [
        'title' => $page_data['title'] ?? 'Page',
        'description' => $page_data['description'] ?? '',
        'keywords' => $page_data['keywords'] ?? '',
        'canonical' => $page_data['canonical'] ?? get_current_url()
    ];
}

/**
 * Generate breadcrumbs
 */
function generate_breadcrumbs($breadcrumbs = []) {
    if (empty($breadcrumbs)) {
        return '';
    }
    
    $html = '<nav class="breadcrumbs" aria-label="Breadcrumb">';
    $html .= '<ol class="breadcrumb-list">';
    
    foreach ($breadcrumbs as $index => $crumb) {
        $is_last = $index === count($breadcrumbs) - 1;
        $html .= '<li class="breadcrumb-item' . ($is_last ? ' active' : '') . '">';
        
        if ($is_last) {
            $html .= '<span>' . htmlspecialchars($crumb['text']) . '</span>';
        } else {
            $html .= '<a href="' . htmlspecialchars($crumb['url']) . '">' . htmlspecialchars($crumb['text']) . '</a>';
        }
        
        $html .= '</li>';
    }
    
    $html .= '</ol></nav>';
    return $html;
}

/**
 * Generate social sharing buttons
 */
function generate_social_buttons($url, $title, $description) {
    $encoded_url = urlencode($url);
    $encoded_title = urlencode($title);
    $encoded_description = urlencode($description);
    
    return '
    <div class="social-share">
        <h4>Share this page:</h4>
        <div class="social-buttons">
            <a href="https://www.facebook.com/sharer/sharer.php?u=' . $encoded_url . '" 
               target="_blank" rel="noopener" class="social-btn facebook" 
               aria-label="Share on Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
            </a>
            <a href="https://twitter.com/intent/tweet?url=' . $encoded_url . '&text=' . $encoded_title . '" 
               target="_blank" rel="noopener" class="social-btn twitter" 
               aria-label="Share on Twitter">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
            </a>
            <a href="https://www.linkedin.com/sharing/share-offsite/?url=' . $encoded_url . '" 
               target="_blank" rel="noopener" class="social-btn linkedin" 
               aria-label="Share on LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
            </a>
        </div>
    </div>';
}

/**
 * Generate related content
 */
function generate_related_content($related_items = []) {
    if (empty($related_items)) {
        return '';
    }
    
    $html = '<section class="related-content">';
    $html .= '<h3>Related Content</h3>';
    $html .= '<div class="related-grid">';
    
    foreach ($related_items as $item) {
        $html .= '<article class="related-item">';
        if (!empty($item['image'])) {
            $html .= '<div class="related-image">';
            $html .= '<img src="' . htmlspecialchars($item['image']) . '" alt="' . htmlspecialchars($item['title']) . '">';
            $html .= '</div>';
        }
        $html .= '<div class="related-content">';
        $html .= '<h4><a href="' . htmlspecialchars($item['url']) . '">' . htmlspecialchars($item['title']) . '</a></h4>';
        if (!empty($item['excerpt'])) {
            $html .= '<p>' . htmlspecialchars($item['excerpt']) . '</p>';
        }
        $html .= '</div>';
        $html .= '</article>';
    }
    
    $html .= '</div></section>';
    return $html;
}

/**
 * Generate contact information
 */
function generate_contact_info($contact_data) {
    $html = '<div class="contact-info">';
    
    if (!empty($contact_data['phone'])) {
        $html .= '<div class="contact-item">';
        $html .= '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">';
        $html .= '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>';
        $html .= '</svg>';
        $html .= '<a href="tel:' . htmlspecialchars($contact_data['phone']) . '">' . htmlspecialchars($contact_data['phone']) . '</a>';
        $html .= '</div>';
    }
    
    if (!empty($contact_data['email'])) {
        $html .= '<div class="contact-item">';
        $html .= '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">';
        $html .= '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>';
        $html .= '<polyline points="22,6 12,13 2,6"></polyline>';
        $html .= '</svg>';
        $html .= '<a href="mailto:' . htmlspecialchars($contact_data['email']) . '">' . htmlspecialchars($contact_data['email']) . '</a>';
        $html .= '</div>';
    }
    
    if (!empty($contact_data['address'])) {
        $html .= '<div class="contact-item">';
        $html .= '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">';
        $html .= '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>';
        $html .= '<circle cx="12" cy="10" r="3"></circle>';
        $html .= '</svg>';
        $html .= '<address>' . htmlspecialchars($contact_data['address']) . '</address>';
        $html .= '</div>';
    }
    
    $html .= '</div>';
    return $html;
}

/**
 * Generate FAQ section
 */
function generate_faq_section($faq_items = []) {
    if (empty($faq_items)) {
        return '';
    }
    
    $html = '<section class="faq-section">';
    $html .= '<h3>Frequently Asked Questions</h3>';
    $html .= '<div class="faq-list">';
    
    foreach ($faq_items as $index => $item) {
        $html .= '<div class="faq-item">';
        $html .= '<button class="faq-question" data-faq="' . $index . '">';
        $html .= '<span>' . htmlspecialchars($item['question']) . '</span>';
        $html .= '<svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">';
        $html .= '<polyline points="6,9 12,15 18,9"></polyline>';
        $html .= '</svg>';
        $html .= '</button>';
        $html .= '<div class="faq-answer">';
        $html .= '<p>' . htmlspecialchars($item['answer']) . '</p>';
        $html .= '</div>';
        $html .= '</div>';
    }
    
    $html .= '</div></section>';
    return $html;
}

/**
 * Generate testimonials
 */
function generate_testimonials($testimonials = []) {
    if (empty($testimonials)) {
        return '';
    }
    
    $html = '<section class="testimonials-section">';
    $html .= '<h3>What Our Clients Say</h3>';
    $html .= '<div class="testimonials-grid">';
    
    foreach ($testimonials as $testimonial) {
        $html .= '<div class="testimonial-card">';
        if (!empty($testimonial['rating'])) {
            $html .= '<div class="testimonial-rating">';
            for ($i = 0; $i < 5; $i++) {
                $class = $i < $testimonial['rating'] ? 'star filled' : 'star';
                $html .= '<svg class="' . $class . '" viewBox="0 0 24 24" fill="currentColor">';
                $html .= '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>';
                $html .= '</svg>';
            }
            $html .= '</div>';
        }
        $html .= '<blockquote>' . htmlspecialchars($testimonial['quote']) . '</blockquote>';
        $html .= '<div class="testimonial-author">';
        if (!empty($testimonial['avatar'])) {
            $html .= '<img src="' . htmlspecialchars($testimonial['avatar']) . '" alt="' . htmlspecialchars($testimonial['name']) . '" class="testimonial-avatar">';
        }
        $html .= '<div class="testimonial-info">';
        $html .= '<h4>' . htmlspecialchars($testimonial['name']) . '</h4>';
        if (!empty($testimonial['company'])) {
            $html .= '<p>' . htmlspecialchars($testimonial['company']) . '</p>';
        }
        $html .= '</div>';
        $html .= '</div>';
        $html .= '</div>';
    }
    
    $html .= '</div></section>';
    return $html;
}

/**
 * Generate call-to-action section
 */
function generate_cta_section($cta_data) {
    $html = '<section class="cta-section">';
    $html .= '<div class="cta-content">';
    $html .= '<h2>' . htmlspecialchars($cta_data['title']) . '</h2>';
    $html .= '<p>' . htmlspecialchars($cta_data['description']) . '</p>';
    $html .= '<div class="cta-buttons">';
    
    if (!empty($cta_data['primary_button'])) {
        $html .= '<a href="' . htmlspecialchars($cta_data['primary_button']['url']) . '" class="btn btn-primary">';
        $html .= htmlspecialchars($cta_data['primary_button']['text']);
        $html .= '</a>';
    }
    
    if (!empty($cta_data['secondary_button'])) {
        $html .= '<a href="' . htmlspecialchars($cta_data['secondary_button']['url']) . '" class="btn btn-outline">';
        $html .= htmlspecialchars($cta_data['secondary_button']['text']);
        $html .= '</a>';
    }
    
    $html .= '</div>';
    $html .= '</div>';
    $html .= '</section>';
    
    return $html;
}

/**
 * Generate sitemap
 */
function generate_sitemap($pages = []) {
    $html = '<?xml version="1.0" encoding="UTF-8"?>';
    $html .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    
    foreach ($pages as $page) {
        $html .= '<url>';
        $html .= '<loc>' . htmlspecialchars($page['url']) . '</loc>';
        $html .= '<lastmod>' . htmlspecialchars($page['lastmod']) . '</lastmod>';
        $html .= '<changefreq>' . htmlspecialchars($page['changefreq']) . '</changefreq>';
        $html .= '<priority>' . htmlspecialchars($page['priority']) . '</priority>';
        $html .= '</url>';
    }
    
    $html .= '</urlset>';
    return $html;
}

/**
 * Generate robots.txt
 */
function generate_robots_txt($site_url) {
    return "User-agent: *\n" .
           "Allow: /\n" .
           "Disallow: /admin/\n" .
           "Disallow: /private/\n" .
           "Sitemap: " . $site_url . "/sitemap.xml\n";
}

/**
 * Output page with proper headers
 */
function output_page($content, $metadata = []) {
    // Set content type
    header('Content-Type: text/html; charset=UTF-8');
    
    // Set cache headers for static content
    if (!empty($metadata['cache'])) {
        header('Cache-Control: public, max-age=' . $metadata['cache']);
        header('Expires: ' . gmdate('D, d M Y H:i:s \G\M\T', time() + $metadata['cache']));
    }
    
    // Output the content
    echo $content;
    exit;
}

/**
 * Handle 404 errors
 */
function handle_404() {
    http_response_code(404);
    header('Content-Type: text/html; charset=UTF-8');
    
    $html = '<!DOCTYPE html>';
    $html .= '<html lang="en">';
    $html .= '<head>';
    $html .= '<meta charset="UTF-8">';
    $html .= '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
    $html .= '<title>Page Not Found - ' . SITE_NAME . '</title>';
    $html .= '<link rel="stylesheet" href="styles.css">';
    $html .= '</head>';
    $html .= '<body>';
    $html .= '<div class="error-page">';
    $html .= '<h1>404 - Page Not Found</h1>';
    $html .= '<p>The page you are looking for could not be found.</p>';
    $html .= '<a href="/" class="btn btn-primary">Go Home</a>';
    $html .= '</div>';
    $html .= '</body>';
    $html .= '</html>';
    
    echo $html;
    exit;
}

/**
 * Handle 500 errors
 */
function handle_500($error_message = 'Internal Server Error') {
    http_response_code(500);
    header('Content-Type: text/html; charset=UTF-8');
    
    $html = '<!DOCTYPE html>';
    $html .= '<html lang="en">';
    $html .= '<head>';
    $html .= '<meta charset="UTF-8">';
    $html .= '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
    $html .= '<title>Server Error - ' . SITE_NAME . '</title>';
    $html .= '<link rel="stylesheet" href="styles.css">';
    $html .= '</head>';
    $html .= '<body>';
    $html .= '<div class="error-page">';
    $html .= '<h1>500 - Server Error</h1>';
    $html .= '<p>Something went wrong. Please try again later.</p>';
    $html .= '<a href="/" class="btn btn-primary">Go Home</a>';
    $html .= '</div>';
    $html .= '</body>';
    $html .= '</html>';
    
    echo $html;
    exit;
}

// Set error handlers
set_error_handler(function($severity, $message, $file, $line) {
    if (!(error_reporting() & $severity)) {
        return;
    }
    throw new ErrorException($message, 0, $severity, $file, $line);
});

// Set exception handler
set_exception_handler(function($exception) {
    log_activity('Exception', $exception->getMessage() . ' in ' . $exception->getFile() . ':' . $exception->getLine());
    handle_500();
});
?> 