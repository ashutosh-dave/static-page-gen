const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

/**
 * Build all content files in the content directory
 */

const CONTENT_DIR = 'content';
const BUILD_DIR = 'build';

function findContentFiles() {
    try {
        const files = fs.readdirSync(CONTENT_DIR);
        return files.filter(file => file.endsWith('.json'));
    } catch (error) {
        console.error(chalk.red(`❌ Error reading content directory: ${error.message}`));
        process.exit(1);
    }
}

function buildFile(fileName) {
    const filePath = path.join(CONTENT_DIR, fileName);
    const outputName = path.basename(fileName, '.json') + '.php';
    
    try {
        console.log(chalk.blue(`🔨 Building: ${fileName} → ${outputName}`));
        
        // Run the generator for this file
        execSync(`node generate.js "${filePath}"`, { 
            stdio: 'inherit',
            encoding: 'utf8'
        });
        
        console.log(chalk.green(`✅ Built: ${outputName}`));
        return true;
        
    } catch (error) {
        console.error(chalk.red(`❌ Failed to build ${fileName}: ${error.message}`));
        return false;
    }
}

function main() {
    console.log(chalk.cyan('🚀 Building all content files...\n'));
    
    // Find all JSON files in content directory
    const contentFiles = findContentFiles();
    
    if (contentFiles.length === 0) {
        console.log(chalk.yellow('📁 No content files found in content/ directory'));
        return;
    }
    
    console.log(chalk.blue(`📁 Found ${contentFiles.length} content files:\n`));
    contentFiles.forEach(file => {
        console.log(chalk.gray(`   📄 ${file}`));
    });
    console.log('');
    
    // Build each file
    let successful = 0;
    let failed = 0;
    
    for (const file of contentFiles) {
        if (buildFile(file)) {
            successful++;
        } else {
            failed++;
        }
    }
    
    // After all files, generate form handlers once
    try {
        require('./generate.js');
        if (typeof generateFormHandlers === 'function') {
            generateFormHandlers();
        }
    } catch (e) {
        // fallback: do nothing
    }
    
    // Report results
    console.log('\n' + chalk.cyan('📊 Build Summary'));
    console.log(chalk.gray('═'.repeat(40)));
    console.log(chalk.white(`Total files: ${contentFiles.length}`));
    console.log(chalk.green(`Successfully built: ${successful}`));
    if (failed > 0) {
        console.log(chalk.red(`Failed: ${failed}`));
    }
    console.log(chalk.gray('═'.repeat(40)));
    
    if (failed === 0) {
        console.log(chalk.green('\n🎉 All files built successfully!'));
        console.log(chalk.blue(`📁 Output directory: ${BUILD_DIR}/`));
        
        // List generated files
        try {
            const buildFiles = fs.readdirSync(BUILD_DIR)
                .filter(file => file.endsWith('.php'))
                .sort();
            
            if (buildFiles.length > 0) {
                console.log(chalk.blue('\n📄 Generated PHP files:'));
                buildFiles.forEach(file => {
                    const stats = fs.statSync(path.join(BUILD_DIR, file));
                    const size = formatBytes(stats.size);
                    console.log(chalk.gray(`   📄 ${file} (${size})`));
                });
            }
        } catch (error) {
            // Ignore errors listing build files
        }
        
    } else {
        console.log(chalk.red('\n❌ Build completed with errors'));
        process.exit(1);
    }
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Run if this script is executed directly
if (require.main === module) {
    main();
} 