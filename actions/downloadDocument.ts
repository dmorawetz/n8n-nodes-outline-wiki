import { IExecuteFunctions } from 'n8n-core';
import { IDataObject, INodeExecutionData } from 'n8n-workflow';
import { OptionsWithUri } from 'request-promise-native';

export async function downloadDocument(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
    const credentials = await this.getCredentials('outlineWikiCredentialsApi');
    let responseData: { data: { text: any; }; };
    // const did = this.getNodeParameter('did', 0) as string;
    const re = /!\[([^\]]*)\]\(\/api\/attachments\.redirect\?id=([^)]*)\)/gmu;

    const did = this.getNodeParameter('documentId', index) as string;
    const data: IDataObject = {
        id: did,
    };

    const options: OptionsWithUri = {
        headers: {
            "Accept": "application/json",
        },
        method: "POST",
        body: data,
        uri: `${credentials.domain}/documents.info`,
        json: true,
    };
    responseData = await this.helpers.requestWithAuthentication.call(this, 'outlineWikiCredentialsApi', options);

    let match: RegExpExecArray | null; 
    let text = responseData.data.text;
    let attachments = [];
    do {
        match = re.exec(text);

        if (match === null) {
            break;
        }

        //    let o: IHttpRequestOptions = {
        //        method: "POST",
        //        body: {
        //            id: match[2],
        //        },
        //        baseURL: `${credentials.domain}`,
        //        url: `/attachments.redirect`,
        //        json: true,
        //        returnFullResponse: true,
        //        encoding: "arraybuffer",
        //    };

        //    let attachment = await this.helpers.httpRequestWithAuthentication.call(this, 'outlineWikiCredentialsApi', o);
        //    console.log(attachment.headers);
        //    let mime = attachment.headers['content-type'];

        //    let buf = Buffer.from(attachment.body, 'binary');
        //    //console.log(attachment.toString('base64'));
        //    let img = buf.toString('base64');
        //    text = text.replace(re, `![${match[1]}](data:${mime};base64,${img})`);
        console.log(match[1]);
        console.log(match[2]);
        attachments.push({ caption: match[1], id: match[2] });
    } while (match !== null);
    //             console.log(text);


    return this.helpers.returnJsonArray({ "text": text, attachments: attachments });

}
