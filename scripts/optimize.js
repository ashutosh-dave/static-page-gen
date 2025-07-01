const fs = require('fs');
const path = require('path');
const minify = require('minify');
const chalk = require('chalk');

/**
 * Optimization script for static site generator
 * Minifies HTML, CSS, and JavaScript files
 */

const BUILD_DIR = 'build';
const ASSETS_DIR = path.join(BUILD_DIR, 'assets');

// File extensions to optimize
const OPTIMIZE_EXTENSIONS = {
    '.html': 'html',
    '.php': 'html', // Treat PHP files as HTML for minification
    '.css': 'css',
    '.js': 'js'
};

/**
 * Get all files recursively from a directory
 */
function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else {
            arrayOfFiles.push(fullPath);
        }
    });

    return arrayOfFiles;
}

/**
 * Check if file should be optimized
 */
function shouldOptimizeFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return OPTIMIZE_EXTENSIONS.hasOwnProperty(ext);
}

/**
 * Get optimization type for file
 */
function getOptimizationType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return OPTIMIZE_EXTENSIONS[ext] || 'text';
}

/**
 * Create backup of original file
 */
function createBackup(filePath) {
    const backupPath = filePath + '.backup';
    if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(filePath, backupPath);
        console.log(chalk.gray(`📋 Created backup: ${path.basename(filePath)}.backup`));
    }
}

/**
 * Optimize a single file
 */
async function optimizeFile(filePath) {
    try {
        const ext = path.extname(filePath).toLowerCase();
        const fileName = path.basename(filePath);
        
        console.log(chalk.blue(`🔧 Optimizing: ${fileName}`));
        
        // Create backup
        createBackup(filePath);
        
        // Read original file
        const originalContent = fs.readFileSync(filePath, 'utf8');
        const originalSize = Buffer.byteLength(originalContent, 'utf8');
        
        // Skip if file is already minified (contains minified indicators)
        if (originalContent.includes('/*minified*/') || originalContent.includes('//minified')) {
            console.log(chalk.yellow(`⏭️  Skipping (already minified): ${fileName}`));
            return;
        }
        
        // Minify content
        let optimizedContent;
        if (ext === '.php') {
            // For PHP files, only minify the HTML parts, preserve PHP code
            optimizedContent = await minifyPHP(originalContent);
        } else {
            optimizedContent = await minify(originalContent, {
                html: {
                    removeAttributeQuotes: false,
                    removeOptionalTags: false,
                    removeRedundantAttributes: false,
                    removeScriptTypeAttributes: false,
                    removeStyleLinkTypeAttributes: false,
                    useShortDoctype: false,
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    preserveLineBreaks: false,
                    removeComments: true
                },
                css: {
                    compatibility: '*',
                    level: {
                        1: {
                            all: true
                        },
                        2: {
                            all: true
                        }
                    }
                },
                js: {
                    compress: {
                        drop_console: false,
                        drop_debugger: true
                    },
                    mangle: {
                        toplevel: false
                    }
                }
            });
        }
        
        const optimizedSize = Buffer.byteLength(optimizedContent, 'utf8');
        const savings = originalSize - optimizedSize;
        const savingsPercent = ((savings / originalSize) * 100).toFixed(1);
        
        // Write optimized content
        fs.writeFileSync(filePath, optimizedContent);
        
        console.log(chalk.green(`✅ Optimized: ${fileName}`));
        console.log(chalk.gray(`   Size: ${formatBytes(originalSize)} → ${formatBytes(optimizedSize)} (${savingsPercent}% smaller)`));
        
        return {
            file: fileName,
            originalSize,
            optimizedSize,
            savings,
            savingsPercent
        };
        
    } catch (error) {
        console.error(chalk.red(`❌ Error optimizing ${path.basename(filePath)}: ${error.message}`));
        return null;
    }
}

/**
 * Minify PHP files while preserving PHP code
 */
async function minifyPHP(content) {
    // Split content into PHP and non-PHP parts
    const parts = content.split(/(<\?php.*?\?>|<\?.*?\?>)/gs);
    let result = '';
    
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        
        if (part.startsWith('<?')) {
            // This is PHP code, preserve as-is
            result += part;
        } else {
            // This is HTML/other content, minify it
            try {
                const minified = await minify(part, {
                    html: {
                        collapseWhitespace: true,
                        conservativeCollapse: true,
                        removeComments: true
                    }
                });
                result += minified;
            } catch (error) {
                // If minification fails, use original
                result += part;
            }
        }
    }
    
    return result;
}

/**
 * Format bytes to human readable format
 */
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Optimize images
 */
async function optimizeImages() {
    const imageFiles = getAllFiles(BUILD_DIR).filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
    });
    
    if (imageFiles.length === 0) {
        console.log(chalk.yellow('📷 No images found to optimize'));
        return;
    }
    
    console.log(chalk.blue(`🖼️  Found ${imageFiles.length} images to optimize`));
    
    // Note: Image optimization would require additional setup
    // For now, just log the files that would be optimized
    imageFiles.forEach(file => {
        console.log(chalk.gray(`   📷 ${path.relative(BUILD_DIR, file)}`));
    });
    
    console.log(chalk.yellow('💡 Image optimization requires additional setup (imagemin)'));
}

/**
 * Generate optimization report
 */
function generateReport(results) {
    const successful = results.filter(r => r !== null);
    const failed = results.length - successful.length;
    
    const totalOriginalSize = successful.reduce((sum, r) => sum + r.originalSize, 0);
    const totalOptimizedSize = successful.reduce((sum, r) => sum + r.optimizedSize, 0);
    const totalSavings = totalOriginalSize - totalOptimizedSize;
    const totalSavingsPercent = ((totalSavings / totalOriginalSize) * 100).toFixed(1);
    
    console.log('\n' + chalk.cyan('📊 Optimization Report'));
    console.log(chalk.gray('═'.repeat(50)));
    console.log(chalk.white(`Files processed: ${results.length}`));
    console.log(chalk.green(`Successfully optimized: ${successful.length}`));
    if (failed > 0) {
        console.log(chalk.red(`Failed: ${failed}`));
    }
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.white(`Total size before: ${formatBytes(totalOriginalSize)}`));
    console.log(chalk.white(`Total size after: ${formatBytes(totalOptimizedSize)}`));
    console.log(chalk.green(`Total savings: ${formatBytes(totalSavings)} (${totalSavingsPercent}%)`));
    console.log(chalk.gray('═'.repeat(50)));
}

/**
 * Main optimization function
 */
async function optimize() {
    console.log(chalk.cyan('🚀 Starting optimization process...\n'));
    
    // Check if build directory exists
    if (!fs.existsSync(BUILD_DIR)) {
        console.error(chalk.red(`❌ Build directory '${BUILD_DIR}' not found. Run 'npm run build' first.`));
        process.exit(1);
    }
    
    // Get all files to optimize
    const allFiles = getAllFiles(BUILD_DIR);
    const filesToOptimize = allFiles.filter(shouldOptimizeFile);
    
    if (filesToOptimize.length === 0) {
        console.log(chalk.yellow('📁 No files found to optimize'));
        return;
    }
    
    console.log(chalk.blue(`📁 Found ${filesToOptimize.length} files to optimize\n`));
    
    // Optimize files
    const results = [];
    for (const file of filesToOptimize) {
        const result = await optimizeFile(file);
        results.push(result);
    }
    
    // Optimize images
    await optimizeImages();
    
    // Generate report
    generateReport(results);
    
    console.log(chalk.green('\n🎉 Optimization completed successfully!'));
}

// Run optimization if this script is executed directly
if (require.main === module) {
    optimize().catch(error => {
        console.error(chalk.red(`❌ Optimization failed: ${error.message}`));
        process.exit(1);
    });
}

module.exports = { optimize, optimizeFile, formatBytes }; 