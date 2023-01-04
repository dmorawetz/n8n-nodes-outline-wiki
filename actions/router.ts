import { IExecuteFunctions } from 'n8n-core';

import { IDataObject, INodeExecutionData } from 'n8n-workflow';

import { downloadDocument } from './downloadDocument'
import { downloadAttachments } from './downloadAttachments'


export async function router(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const operationResult: INodeExecutionData[] = [];
    let responseData: IDataObject | IDataObject[] = [];

    for (let i = 0; i < items.length; i++) {
        const resource = this.getNodeParameter('resource', i);
        let operation = this.getNodeParameter('operation', i);

        if (resource == "document") {
            if (operation == "download") {
                responseData = await downloadDocument.call(this, i);
            } else if (operation == "downloadAttachments") {
                responseData = await downloadAttachments.call(this, i);
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

