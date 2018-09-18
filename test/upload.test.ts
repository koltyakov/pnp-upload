import * as path from 'path';
import { AuthConfig } from 'node-sp-auth-config';
import * as ProgressBar from 'progress';

import { Upload } from '../src';

const filePath = path.join(__dirname, './ReplaceWithLargeOne.avi');
// const filePath = `D:\\Distrib\\ubuntu-16.04.2-server-amd64.iso`;
const folderUrl = 'Shared Documents';

new AuthConfig().getContext()
  .then(context => {

    const upload = new Upload(context);
    const folderRelativeUrl = `/${context.siteUrl.split('/').slice(3).join('/')}/${folderUrl}`;

    let progress: ProgressBar = null;
    return upload.addChunked(folderRelativeUrl, filePath, data => {
      if (!progress) {
        progress = new ProgressBar(`Uploading ${filePath} [:bar] ${data.fileSize} KB`, { total: data.totalBlocks });
      }
      progress.tick();
    });

  })
  .then(_ => {
    console.log('Done');
  })
  .catch(console.log);
