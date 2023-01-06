import { IExecuteFunctions } from 'n8n-core';
import { INodeExecutionData } from 'n8n-workflow';

export async function fixMarkdownExport(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
    const fixSlash = this.getNodeParameter('fixSlashOnEmptyLine', index) as boolean;
    const fixCitations = this.getNodeParameter('fixSquareBracketCitations', index) as boolean;
    const items = this.getInputData();
    let text = items[index].json.text as string;


    if (fixSlash) {
        text = text.replace(/^\\$/gm, '');
    }

    if (fixCitations) {
        text = text.replace(/\\\[(@.*?)\\\]/gmu, '[$1]');
    }

    return this.helpers.returnJsonArray({ ...items[index].json, text });
}
