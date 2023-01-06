import { IExecuteFunctions } from 'n8n-core';

import { IDataObject, INodeExecutionData } from 'n8n-workflow';

import { downloadDocument } from './downloadDocument'
import { listDocuments } from './listDocuments'
import { extractAttachments } from './extractAttachments'
import { downloadAttachments } from './downloadAttachments'
import { replaceImageLinks } from './replaceImageLinks'
import { fixMarkdownExport } from './fixMarkdownExport'


export async function router(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    let operationResult: INodeExecutionData[] = [];
    let responseData: IDataObject | IDataObject[] = [];

    const resource = this.getNodeParameter('resource', 0);
    const operation = this.getNodeParameter('operation', 0);

    if (resource == "document" && operation == "replaceImageLinks") {
        operationResult = await replaceImageLinks.call(this);
    }

    for (let i = 0; i < items.length; i++) {
        if (resource == "document") {
            if (operation == "downloadDocument" || operation == "downloadDocuments") {
                responseData = await downloadDocument.call(this, operation, i);
            } else if (operation == "listDocuments") {
                responseData = await listDocuments.call(this, i);
            } else if (operation == "extractAttachments") {
                responseData = await extractAttachments.call(this, i);
            } else if (operation == "downloadAttachments") {
                responseData = await downloadAttachments.call(this, i);
            } else if (operation == "fixMarkdownExport") {
                responseData = await fixMarkdownExport.call(this, i);
            }
        }

        const executionData = this.helpers.constructExecutionMetaData(
            this.helpers.returnJsonArray(responseData),
            { itemData: { item: i } },
        );
        operationResult.push(...executionData);
    }

    return [operationResult];
}

