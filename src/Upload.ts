import { sp, ChunkedFileUploadProgressData, FileAddResult } from '@pnp/sp';
import * as fs from 'fs';
import * as path from 'path';
import { PnpNode } from 'sp-pnp-node';
import { IAuthContext } from 'node-sp-auth-config';

export class Upload {

  constructor(context: IAuthContext) {
    sp.setup({
      sp: {
        fetchClientFactory: () => {
          return new PnpNode(context);
        }
      }
    });
  }

  public addChunked(
    folderRelativeUrl: string,
    filePath: string,
    progress?: (data: ChunkedFileUploadProgressData) => void
  ): Promise<FileAddResult> {
    const fileName = path.parse(filePath).name + path.parse(filePath).ext;
    return this.readFile(filePath)
      .then(content => {
        return sp.web.getFolderByServerRelativeUrl(folderRelativeUrl)
          .files.addChunked(fileName, content as any, progress, true);
      });
  }

  private readFile(filePath: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      fs.stat(filePath, (statErr, stats) => {
        if (statErr) {
          return reject(statErr);
        }
        fs.readFile(filePath, (err, buffer) => {
          if (err) {
            return reject(err);
          }
          (buffer as any).size = stats.size;
          resolve(buffer);
        });
      });
    });
  }

}
