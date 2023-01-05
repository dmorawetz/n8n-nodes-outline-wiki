import { IExecuteFunctions } from 'n8n-core';
import { IDataObject, IHttpRequestOptions, INodeExecutionData } from 'n8n-workflow';
import mime from 'mime-types';

export async function downloadAttachments(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
    const credentials = await this.getCredentials('outlineWikiCredentialsApi');
    const attachmentBuffers: IDataObject[] = [];
    const filePrefix = this.getNodeParameter('filePrefix', index) as string;
    const items = this.getInputData();
    let text = items[index].json.text as string;
    const attachments = items[index].json.attachments as IDataObject[];

    if (attachments === null || attachments === undefined) {
        return this.helpers.returnJsonArray({ text, attachments: [] });
    }

    for (let a of attachments) {
        let o: IHttpRequestOptions = {
            method: "POST",
            body: {
                id: a.id,
            },
            baseURL: `${credentials.domain}`,
            url: `/attachments.redirect`,
            json: true,
            returnFullResponse: true,
            encoding: "arraybuffer",
        };


        let attachment = await this.helpers.httpRequestWithAuthentication.call(this, 'outlineWikiCredentialsApi', o);
        let contentType = attachment.headers["content-type"];
        let fileExtension = mime.extension(contentType);
        let fileName = `${filePrefix}${a.id}.${fileExtension}`;

        text = text.replace(`(/api/attachments.redirect?id=${a.id})`, `(${fileName})`);

        let buf = Buffer.from(attachment.body, 'binary');
        attachmentBuffers.push({
            id: a.id,
            headers: attachment.headers,
            fileName,
            fileExtension,
            contentType,
            data: buf.toString('base64'),
        });
    }

    return this.helpers.returnJsonArray({ ...items[index].json, text, attachments: attachmentBuffers });
}
