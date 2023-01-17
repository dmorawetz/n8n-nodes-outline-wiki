import { IExecuteFunctions } from 'n8n-core';
import { INodeExecutionData, NodeOperationError } from 'n8n-workflow';

export async function extractAttachments(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
    const items = this.getInputData();

    const re = /!\[(.*?)\]\(\/api\/attachments\.redirect\?id=([^)"]*)( "|\))/gmu;

    let text = items[index].json.text as string;

    if (text === undefined) {
        throw new NodeOperationError(
            this.getNode(),
            "Missing document text",
            { itemIndex: index }
        )
    }

    let match: RegExpExecArray | null;
    let attachments = [];
    do {
        match = re.exec(text);

        if (match === null) {
            break;
        }

        attachments.push({ caption: match[1], id: match[2] });
    } while (match !== null);

    return this.helpers.returnJsonArray({ ...items[index].json, attachments });
}
