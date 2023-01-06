import { BINARY_ENCODING, IExecuteFunctions } from 'n8n-core';
import { fileTypeFromMimeType, IBinaryData, IDataObject, IHttpRequestOptions, INodeExecutionData } from 'n8n-workflow';
import mime from 'mime-types';

export async function downloadAttachments(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
    const credentials = await this.getCredentials('outlineWikiCredentialsApi');
    const filePrefix = this.getNodeParameter('filePrefix', index) as string;
    const items = this.getInputData();
    //   let text = items[index].json.text as string;
    const attachments = items[index].json.attachments as IDataObject[];
    const returnData: INodeExecutionData[] = [];

    if (attachments === null || attachments === undefined) {
        return this.helpers.returnJsonArray(items);
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

        //        text = text.replace(`(/api/attachments.redirect?id=${a.id})`, `(${fileName})`);

        let buf = Buffer.from(attachment.body, 'binary');

        let data: IBinaryData = {
            data: buf.toString(BINARY_ENCODING),
            mimeType: contentType,
            fileExtension: fileExtension as string,
            fileName,
            fileType: fileTypeFromMimeType(contentType),
        }

        let newItem: INodeExecutionData = {
            json: {
                id: a.id,
                headers: attachment.headers,
                document: items[index].json,
            },
            binary: { data },
            pairedItem: {
                item: index,
            }
        }

        returnData.push(newItem);
    }

    if (returnData.length == 0) {
        returnData.push({
            json: {
                document: items[index].json,
            }
        })
    }

    return this.helpers.returnJsonArray(returnData);
}
