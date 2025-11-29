#!/usr/bin/env node

/**
 * Version Bumping Script
 * 
 * Automatically bumps version numbers following Semantic Versioning.
 * Updates package.json, app.json, and creates git tag.
 * 
 * Usage:
 *   npm run version:patch  # 1.0.0 -> 1.0.1
 *   npm run version:minor  # 1.0.0 -> 1.1.0
 *   npm run version:major  # 1.0.0 -> 2.0.0
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function error(message) {
  log(`❌ ${message}`, colors.red);
  process.exit(1);
}

function success(message) {
  log(`✅ ${message}`, colors.green);
}

function info(message) {
  log(`ℹ️  ${message}`, colors.cyan);
}

function warn(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

/**
 * Parse semantic version
 */
function parseVersion(version) {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)(-(.+))?$/);
  if (!match) {
    error(`Invalid version format: ${version}`);
  }
  
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
    prerelease: match[5] || null,
  };
}

/**
 * Bump version
 */
function bumpVersion(current, type) {
  const version = parseVersion(current);
  
  switch (type) {
    case 'major':
      version.major++;
      version.minor = 0;
      version.patch = 0;
      break;
    case 'minor':
      version.minor++;
      version.patch = 0;
      break;
    case 'patch':
      version.patch++;
      break;
    case 'prerelease':
      if (version.prerelease) {
        const match = version.prerelease.match(/^(.+)\.(\d+)$/);
        if (match) {
          const num = parseInt(match[2], 10) + 1;
          version.prerelease = `${match[1]}.${num}`;
        } else {
          version.prerelease = `${version.prerelease}.1`;
        }
      } else {
        version.prerelease = 'beta.0';
      }
      break;
    default:
      error(`Invalid bump type: ${type}. Use major, minor, patch, or prerelease.`);
  }
  
  let newVersion = `${version.major}.${version.minor}.${version.patch}`;
  if (version.prerelease) {
    newVersion += `-${version.prerelease}`;
  }
  
  return newVersion;
}

/**
 * Update package.json
 */
function updatePackageJson(newVersion) {
  const packagePath = path.join(process.cwd(), 'package.json');
  const package = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  const oldVersion = package.version;
  package.version = newVersion;
  
  fs.writeFileSync(packagePath, JSON.stringify(package, null, 2) + '\n');
  success(`Updated package.json: ${oldVersion} → ${newVersion}`);
  
  return oldVersion;
}

/**
 * Update app.json (Expo)
 */
function updateAppJson(newVersion) {
  const appJsonPath = path.join(process.cwd(), 'app.json');
  
  if (!fs.existsSync(appJsonPath)) {
    warn('app.json not found, skipping');
    return;
  }
  
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
  
  if (appJson.expo) {
    const oldVersion = appJson.expo.version;
    appJson.expo.version = newVersion;
    
    // Also update iOS and Android build numbers
    if (appJson.expo.ios) {
      const parsed = parseVersion(newVersion);
      appJson.expo.ios.buildNumber = `${parsed.major}.${parsed.minor}.${parsed.patch}`;
    }
    
    if (appJson.expo.android) {
      const parsed = parseVersion(newVersion);
      const versionCode = parsed.major * 10000 + parsed.minor * 100 + parsed.patch;
      appJson.expo.android.versionCode = versionCode;
    }
    
    fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + '\n');
    success(`Updated app.json: ${oldVersion} → ${newVersion}`);
  }
}

/**
 * Create git commit and tag
 */
function gitCommitAndTag(version, skipGit = false) {
  if (skipGit) {
    info('Skipping git commit and tag (--no-git flag)');
    return;
  }
  
  try {
    // Check if there are uncommitted changes (other than version files)
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    const versionFiles = status
      .split('\n')
      .filter(line => line.trim())
      .filter(line => !line.includes('package.json') && !line.includes('app.json'));
    
    if (versionFiles.length > 0) {
      warn('There are uncommitted changes. Consider committing them first.');
      warn('Continuing with version bump...');
    }
    
    // Stage version files
    execSync('git add package.json');
    if (fs.existsSync(path.join(process.cwd(), 'app.json'))) {
      execSync('git add app.json');
    }
    
    // Commit
    execSync(`git commit -m "chore: bump version to ${version}"`);
    success(`Created git commit`);
    
    // Tag
    execSync(`git tag -a v${version} -m "Version ${version}"`);
    success(`Created git tag v${version}`);
    
    info('Run "git push && git push --tags" to push changes');
  } catch (err) {
    warn(`Git operations failed: ${err.message}`);
    warn('Version files updated but not committed');
  }
}

/**
 * Generate changelog entry
 */
function generateChangelogEntry(version, oldVersion) {
  const date = new Date().toISOString().split('T')[0];
  
  try {
    const commits = execSync(
      `git log v${oldVersion}..HEAD --pretty=format:"%s" --no-merges`,
      { encoding: 'utf8' }
    );
    
    if (!commits.trim()) {
      return '';
    }
    
    const lines = commits.split('\n').filter(line => line.trim());
    
    let changelog = `\n## [${version}] - ${date}\n\n`;
    
    const features = lines.filter(l => l.startsWith('feat'));
    const fixes = lines.filter(l => l.startsWith('fix'));
    const chores = lines.filter(l => l.startsWith('chore'));
    const others = lines.filter(l => !l.match(/^(feat|fix|chore):/));
    
    if (features.length) {
      changelog += '### Features\n';
      features.forEach(f => {
        changelog += `- ${f.replace(/^feat:\s*/, '')}\n`;
      });
      changelog += '\n';
    }
    
    if (fixes.length) {
      changelog += '### Bug Fixes\n';
      fixes.forEach(f => {
        changelog += `- ${f.replace(/^fix:\s*/, '')}\n`;
      });
      changelog += '\n';
    }
    
    if (chores.length) {
      changelog += '### Chores\n';
      chores.forEach(c => {
        changelog += `- ${c.replace(/^chore:\s*/, '')}\n`;
      });
      changelog += '\n';
    }
    
    if (others.length) {
      changelog += '### Other Changes\n';
      others.forEach(o => {
        changelog += `- ${o}\n`;
      });
      changelog += '\n';
    }
    
    return changelog;
  } catch (err) {
    warn('Could not generate changelog from git history');
    return '';
  }
}

/**
 * Update CHANGELOG.md
 */
function updateChangelog(version, oldVersion) {
  const changelogPath = path.join(process.cwd(), 'CHANGELOG.md');
  
  const entry = generateChangelogEntry(version, oldVersion);
  
  if (!entry) {
    info('No changes to add to CHANGELOG.md');
    return;
  }
  
  let changelog = '';
  
  if (fs.existsSync(changelogPath)) {
    changelog = fs.readFileSync(changelogPath, 'utf8');
  } else {
    changelog = '# Changelog\n\nAll notable changes to this project will be documented in this file.\n';
  }
  
  // Insert new entry after the header
  const lines = changelog.split('\n');
  const headerEnd = lines.findIndex(line => line.startsWith('##')) || 2;
  lines.splice(headerEnd, 0, entry);
  
  fs.writeFileSync(changelogPath, lines.join('\n'));
  success('Updated CHANGELOG.md');
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    error('Usage: npm run version:patch|minor|major [--no-git] [--no-changelog]');
  }
  
  const type = args[0];
  const skipGit = args.includes('--no-git');
  const skipChangelog = args.includes('--no-changelog');
  
  // Read current version
  const packagePath = path.join(process.cwd(), 'package.json');
  const package = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const currentVersion = package.version;
  
  info(`Current version: ${currentVersion}`);
  
  // Calculate new version
  const newVersion = bumpVersion(currentVersion, type);
  
  info(`New version: ${newVersion}`);
  
  // Confirm
  if (process.env.CI !== 'true' && !process.env.SKIP_CONFIRM) {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    
    readline.question(`Bump version to ${newVersion}? (y/N) `, (answer) => {
      readline.close();
      
      if (answer.toLowerCase() !== 'y') {
        info('Version bump cancelled');
        process.exit(0);
      }
      
      performBump();
    });
  } else {
    performBump();
  }
  
  function performBump() {
    // Update files
    const oldVersion = updatePackageJson(newVersion);
    updateAppJson(newVersion);
    
    // Update changelog
    if (!skipChangelog) {
      updateChangelog(newVersion, oldVersion);
    }
    
    // Git operations
    gitCommitAndTag(newVersion, skipGit);
    
    success(`\n🎉 Version bumped to ${newVersion}`);
    
    if (!skipGit) {
      info('\nNext steps:');
      info('  1. Review the changes');
      info('  2. Push: git push && git push --tags');
      info('  3. Create a release on GitHub');
    }
  }
}

// Run
try {
  main();
} catch (err) {
  error(err.message);
}

