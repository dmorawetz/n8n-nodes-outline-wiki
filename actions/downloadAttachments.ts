import { IExecuteFunctions } from 'n8n-core';
import { IDataObject, IHttpRequestOptions, INodeExecutionData } from 'n8n-workflow';

export async function downloadAttachments(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
    const credentials = await this.getCredentials('outlineWikiCredentialsApi');
    //let responseData: { data: { text: any; }; };
    // const did = this.getNodeParameter('did', 0) as string;
    const attachmentBuffers: IDataObject[] = [];

    console.log(index);

    const items = this.getInputData();

    const text = items[index].json.text;
    const attachments = items[index].json.attachments as IDataObject[];

    console.log("text", text);
    console.log("attachments", attachments);

    if (attachments === null || attachments === undefined) {
        return this.helpers.returnJsonArray([]);
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

        let buf = Buffer.from(attachment.body, 'binary');
        attachmentBuffers.push({id: a.id, headers: attachment.headers, data: buf.toString('base64')});
    }


    return this.helpers.returnJsonArray(attachmentBuffers);

}
