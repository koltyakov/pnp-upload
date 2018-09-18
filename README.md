# SharePoint large files upload example using PnPjs

## Dependencies

```bash
npm run install
```
## Test

Replace `./test/ReplaceWithLargeOne.avi` with a large file to upload to SHarePoint.

In a console, run the following command:

```bash
npm run test
```

Provide SharePoint credentials during first execution.

![upload](./assets/upload.png)

## Upload method

PnPjs's `.addChunked` API implementation is used for uploading a large document in chunks.

## Usage sample

```typescript
const filePath = './file-path.ext';
const folderUrl = 'Shared Documents';
// context - authentication context, see `./test/upload.test.ts` for more details

const upload = new Upload(context);
const folderRelativeUrl = `/${context.siteUrl.split('/').slice(3).join('/')}/${folderUrl}`;

let progress: ProgressBar = null;
upload
  .addChunked(folderRelativeUrl, filePath, data => {
    if (!progress) {
      progress = new ProgressBar(`Uploading ${filePath} [:bar] ${data.fileSize} KB`, { total: data.totalBlocks });
    }
    progress.tick();
  })
  .then(_ => console.log('Done'))
  .catch(console.log);
```
