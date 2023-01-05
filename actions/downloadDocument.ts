import { IExecuteFunctions } from 'n8n-core';
import { INodeExecutionData, NodeOperationError } from 'n8n-workflow';
import { OptionsWithUri } from 'request-promise-native';

export async function downloadDocument(this: IExecuteFunctions, operation: string, index: number): Promise<INodeExecutionData[]> {
    const credentials = await this.getCredentials('outlineWikiCredentialsApi');
    const items = this.getInputData();
    let responseData: { data: { text: any; url: any; }; };

    let documentId: string | undefined = undefined;

    if (operation == "downloadDocument") {
        documentId = this.getNodeParameter('documentId', index) as string;
    } else if (operation == "downloadDocuments") {
        documentId = items[index].json.id as string;
    }

    if (documentId === undefined) {
        throw new NodeOperationError(
            this.getNode(),
            "Missing document id",
            { itemIndex: index }
        )
    }

    const options: OptionsWithUri = {
        headers: {
            "Accept": "application/json",
        },
        method: "POST",
        body: {
            id: documentId,
        },
        uri: `${credentials.domain}/documents.info`,
        json: true,
    };
    responseData = await this.helpers.requestWithAuthentication.call(this, 'outlineWikiCredentialsApi', options);

    let escapedTitle = responseData.data.url.replace('/doc/', '');

    return this.helpers.returnJsonArray({ ...responseData.data, escapedTitle });
}
