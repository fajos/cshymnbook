/**
 * Script to automatically upload all downloaded hymn tunes (Organ & Piano) to Cloudflare R2.
 * 
 * Usage:
 *   node scripts/upload_to_r2.js <ACCOUNT_ID> <ACCESS_KEY_ID> <SECRET_ACCESS_KEY> <BUCKET_NAME>
 * 
 * Or set environment variables:
 *   CLOUDFLARE_ACCOUNT_ID
 *   R2_ACCESS_KEY_ID
 *   R2_SECRET_ACCESS_KEY
 *   R2_BUCKET_NAME
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Ensure @aws-sdk/client-s3 is available
try {
  require.resolve('@aws-sdk/client-s3');
} catch (e) {
  console.log('Installing @aws-sdk/client-s3 for S3-compatible R2 upload...');
  execSync('npm install --no-save @aws-sdk/client-s3', { stdio: 'inherit' });
}

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const accountId = process.argv[2] || process.env.CLOUDFLARE_ACCOUNT_ID;
const accessKeyId = process.argv[3] || process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.argv[4] || process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.argv[5] || process.env.R2_BUCKET_NAME || 'cshymn-tunes';

if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
  console.log(`
Cloudflare R2 Tune Uploader
---------------------------
Usage:
  node scripts/upload_to_r2.js <ACCOUNT_ID> <ACCESS_KEY_ID> <SECRET_ACCESS_KEY> [BUCKET_NAME]

How to get your credentials in 60 seconds:
1. Log into your Cloudflare Dashboard -> Go to "R2".
2. Your "Account ID" is displayed on the right sidebar of the R2 overview page.
3. Click "Manage R2 API Tokens" -> "Create API Token".
   - Permissions: "Object Read & Write".
   - Specify bucket or select "All buckets".
4. Copy the "Access Key ID" and "Secret Access Key".
5. Run this command with those 4 values!
`);
  process.exit(1);
}

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const RECORDINGS_DIR = path.resolve(__dirname, '..', 'tune_recordings');

async function main() {
  const instruments = ['organ', 'piano'];
  const uploadQueue = [];

  for (const inst of instruments) {
    const dir = path.join(RECORDINGS_DIR, inst);
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.mp3'));
    for (const file of files) {
      uploadQueue.push({
        filePath: path.join(dir, file),
        key: `${inst}/${file}`,
      });
    }
  }

  console.log(`Found ${uploadQueue.length} files to upload to Cloudflare R2 bucket "${bucketName}"...`);

  let completed = 0;
  const CONCURRENCY = 8;
  let active = 0;
  let idx = 0;

  return new Promise((resolve) => {
    function next() {
      if (idx >= uploadQueue.length && active === 0) {
        console.log(`\nAll ${completed} audio files successfully uploaded to Cloudflare R2!`);
        return resolve();
      }

      while (active < CONCURRENCY && idx < uploadQueue.length) {
        const item = uploadQueue[idx++];
        active++;

        const fileContent = fs.readFileSync(item.filePath);
        s3.send(
          new PutObjectCommand({
            Bucket: bucketName,
            Key: item.key,
            Body: fileContent,
            ContentType: 'audio/mpeg',
          })
        )
          .then(() => {
            completed++;
            if (completed % 25 === 0 || completed === uploadQueue.length) {
              process.stdout.write(`Uploaded ${completed}/${uploadQueue.length} tunes...\n`);
            }
          })
          .catch((err) => {
            console.error(`Failed to upload ${item.key}:`, err.message);
          })
          .finally(() => {
            active--;
            next();
          });
      }
    }

    next();
  });
}

main().catch(console.error);
