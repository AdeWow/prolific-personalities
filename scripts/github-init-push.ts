// Initialize GitHub repo and push all code
import { Octokit } from '@octokit/rest';
import * as fs from 'fs';
import * as path from 'path';

async function getAccessToken() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  const connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken!
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  return connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;
}

const EXCLUDE = new Set([
  'node_modules', '.git', '.cache', '.replit', 'replit.nix', '.upm',
  '.config', 'dist', '.npm', 'package-lock.json', '.breakpoints', '.local',
  'scripts/github-push-api.ts', 'scripts/push-to-github.ts', 'scripts/github-init-push.ts'
]);

function shouldInclude(filePath: string): boolean {
  const parts = filePath.split('/');
  return !parts.some(part => EXCLUDE.has(part));
}

function getAllFiles(dir: string, baseDir: string = dir): string[] {
  const files: string[] = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(baseDir, fullPath);
      
      if (!shouldInclude(relativePath)) continue;
      
      if (entry.isDirectory()) {
        files.push(...getAllFiles(fullPath, baseDir));
      } else {
        files.push(relativePath);
      }
    }
  } catch (e) {}
  return files;
}

async function main() {
  const accessToken = await getAccessToken();
  const octokit = new Octokit({ auth: accessToken });
  
  const owner = 'AdeWow';
  const repo = 'prolific-personalities';
  
  console.log('Step 1: Creating initial README to initialize repo...');
  
  // Create initial file to initialize the repo
  try {
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: 'README.md',
      message: 'Initial commit',
      content: Buffer.from('# Prolific Personalities\n\nResearch-backed productivity assessment platform.\n').toString('base64')
    });
    console.log('  Created README.md');
  } catch (e: any) {
    if (e.status === 422) {
      console.log('  README already exists, continuing...');
    } else {
      throw e;
    }
  }
  
  // Wait a moment for GitHub to process
  await new Promise(r => setTimeout(r, 2000));
  
  console.log('\nStep 2: Getting base commit...');
  const { data: ref } = await octokit.git.getRef({
    owner,
    repo,
    ref: 'heads/main'
  });
  const baseCommitSha = ref.object.sha;
  console.log(`  Base commit: ${baseCommitSha.slice(0, 7)}`);
  
  console.log('\nStep 3: Gathering files...');
  const files = getAllFiles('.');
  console.log(`  Found ${files.length} files`);
  
  console.log('\nStep 4: Creating blobs...');
  const tree: Array<{path: string, mode: '100644', type: 'blob', sha: string}> = [];
  
  let count = 0;
  let errors = 0;
  for (const file of files) {
    try {
      const content = fs.readFileSync(file);
      const base64Content = content.toString('base64');
      
      const { data: blob } = await octokit.git.createBlob({
        owner,
        repo,
        content: base64Content,
        encoding: 'base64'
      });
      
      tree.push({
        path: file,
        mode: '100644',
        type: 'blob',
        sha: blob.sha
      });
      
      count++;
      if (count % 25 === 0) {
        console.log(`  Uploaded ${count}/${files.length} files...`);
      }
    } catch (e: any) {
      errors++;
      if (errors <= 5) {
        console.log(`  Error on ${file}: ${e.message?.slice(0, 50)}`);
      }
    }
  }
  
  console.log(`  Uploaded ${count} files (${errors} errors)`);
  
  if (tree.length === 0) {
    console.log('No files to push!');
    return;
  }
  
  console.log('\nStep 5: Creating tree...');
  const { data: treeData } = await octokit.git.createTree({
    owner,
    repo,
    tree,
    base_tree: baseCommitSha
  });
  
  console.log('\nStep 6: Creating commit...');
  const { data: commit } = await octokit.git.createCommit({
    owner,
    repo,
    message: 'Add Prolific Personalities codebase\n\nResearch-backed productivity assessment with 7 archetypes,\nStripe payments, Replit Auth, and premium playbooks.',
    tree: treeData.sha,
    parents: [baseCommitSha]
  });
  
  console.log('\nStep 7: Updating main branch...');
  await octokit.git.updateRef({
    owner,
    repo,
    ref: 'heads/main',
    sha: commit.sha
  });
  
  console.log('\n✅ SUCCESS! Your code is now on GitHub!');
  console.log(`\n📁 View your repo: https://github.com/${owner}/${repo}`);
}

main().catch(e => {
  console.error('Failed:', e.message);
  process.exit(1);
});
