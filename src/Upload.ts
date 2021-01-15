import * as fs from 'fs';
import * as path from 'path';

import { IAuthContext } from 'node-sp-auth-config';
import { sp, Web, IWeb, IFileAddResult, IFileUploadProgressData } from '@pnp/sp-commonjs/presets/all';
import '@pnp/nodejs-commonjs'; // include extensions to support Node.js streams

import NodeFetchClient from 'pnp-auth/lib/NodeFetchClient';

export class Upload {

  private web: IWeb;

  constructor(context: IAuthContext) {
    const fetchFactory = new NodeFetchClient(context.authOptions, context.siteUrl);
    sp.setup({
      sp: {
        fetchClientFactory: () => fetchFactory
      }
    });
    this.web = Web(context.siteUrl);
  }

  public async addChunked(
    folderRelativeUrl: string,
    filePath: string,
    progress?: (data: IFileUploadProgressData) => void,
    chunkSize = 10485760
  ): Promise<IFileAddResult> {

    let ticker: (data: IFileUploadProgressData) => void = 'function' === typeof progress ? (() => {
      const stats = fs.statSync(filePath);
      // In a stream object there is no `size` property, so IFileUploadProgressData object can't know
      // `fileSize` and `totalBlocks` without externally provided size received e.g. with fs.stat.
      // This wraps provided `progress` callback and enriches data argument to contain missed props.
      return (data: IFileUploadProgressData): void => {
        data.fileSize = stats.size;
        data.totalBlocks = data.totalBlocks ??
          parseInt((data.fileSize / chunkSize).toString(), 10) + ((data.fileSize % chunkSize === 0) ? 1 : 0);
        progress(data);
      };
    })() : null;

    const fileName = path.parse(filePath).name + path.parse(filePath).ext;
    const rs = fs.createReadStream(filePath, { highWaterMark: chunkSize }); // highWaterMark must be equal to chunkSize

    return this.web.getFolderByServerRelativeUrl(folderRelativeUrl)
      .files.addChunked(fileName, rs, ticker, true, chunkSize);
  }

}
