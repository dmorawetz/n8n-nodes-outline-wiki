import { IExecuteFunctions } from 'n8n-core';
import { INodeExecutionData, NodeOperationError } from 'n8n-workflow';
import { OptionsWithUri } from 'request-promise-native';

export async function listDocuments(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
    const credentials = await this.getCredentials('outlineWikiCredentialsApi');
    let responseData: any;

    let parentDocumentId = this.getNodeParameter('parentDocumentId', index) as string;
    let limit = this.getNodeParameter('limit', index) as number;

    const options: OptionsWithUri = {
        headers: {
            "Accept": "application/json",
        },
        method: "POST",
        body: {
            parentDocumentId,
            limit,
        },
        uri: `${credentials.domain}/documents.list`,
        json: true,
    };
    responseData = await this.helpers.requestWithAuthentication.call(this, 'outlineWikiCredentialsApi', options);
    console.log(responseData);

    if (!responseData.ok) {
        throw new NodeOperationError(
            this.getNode(),
            `Error fetching list of documents: ${responseData.statusCode} ${responseData.statusMessage}`,
            { itemIndex: index }
        )
    }

    let documents = [];

    for (const d of responseData.data) {
        const escapedTitle = d.url.replace('/doc/', '');
        documents.push({ ...d, escapedTitle });
    }

    return this.helpers.returnJsonArray(documents);
}
