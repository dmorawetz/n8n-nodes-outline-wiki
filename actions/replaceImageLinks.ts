import { IExecuteFunctions } from 'n8n-core';
import { IDataObject, INodeExecutionData } from 'n8n-workflow';

export async function replaceImageLinks(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    const docs: Map<string, IDataObject> = new Map();
    const attachments: Map<string, IDataObject[]> = new Map();

    for (const i of items) {
        const d = i.json as { document: { id: string, text: string } };
        docs.set(d.document.id, d.document);
        if (!attachments.has(d.document.id)) {
            attachments.set(d.document.id, []);
        }
        if (i.binary) {
            attachments.get(d.document.id)!.push({ ...i.json, fileName: i.binary!.data.fileName });
        }
    }

    for (const [did, d] of docs) {
        let text = d.text as string;

        for (const a of attachments.get(did)!) {
            const re = new RegExp(`\\(\/api\/attachments\\.redirect\\?id=${a.id}[^)]*\\)`);
            text = text.replace(re, `(${a.fileName})`);
        }

        returnData.push({
            json: {
                ...d,
                text,
            },
        })

    }

    return this.helpers.returnJsonArray(returnData);
}
