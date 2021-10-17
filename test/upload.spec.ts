import * as Mocha from 'mocha';
import * as path from 'path';
import * as ProgressBar from 'progress';

import { Upload } from '../src';
import { Environments } from './configs';
import { getAuth } from './utils';

const filePath = path.join(__dirname, 'ReplaceWithLargeOne.avi');
const folderUrl = 'Shared Documents'; // Web relative target folder

describe('pnp-upload tests', () => {
  for (const config of Environments) {

    it('should upload a document', function(done: Mocha.Done): void {
      this.timeout(30 * 1000);
      getAuth(config).then(async (context) => {

        const upload = new Upload(context);
        const folderRelativeUrl = `/${context.siteUrl.split('/').slice(3).join('/')}/${folderUrl}`;

        let progress: ProgressBar = null;
        await upload.addChunked(folderRelativeUrl, filePath, (data) => {
          if (!progress) {
            progress = new ProgressBar(`Uploading ${filePath} [:bar] ${data.fileSize} KB`, {
              total: data.totalBlocks,
              width: 20
            });
          }
          progress.tick();
        });

        done();
      }).catch(done);
    });
  }
});
