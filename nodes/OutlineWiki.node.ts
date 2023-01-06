import {
    IExecuteFunctions, 
} from 'n8n-core';

import { router } from '../actions/router'

import {
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
} from 'n8n-workflow';

export class OutlineWiki implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Outline Wiki',
        name: 'outlinewiki',
        //icon: 'file:friendGrid.svg',
        group: ['transform'],
        version: 3,
        icon: 'file:outline-wiki-logo.svg',
        description: 'Consume OutlineWiki API',
        defaults: {
            name: 'Outline',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'outlineWikiCredentialsApi',
                required: true,
            },
        ],
        requestDefaults: {
            baseURL: '={{$credentials?.domain}}'
        },
        properties: [
            // Resources and operations will go here
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                options: [
                    {
                        name: 'Document',
                        value: 'document',
                    },
                ],
                default: 'document',
                description: 'Document',
                required: true,
                noDataExpression: true,
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                options: [
                    {
                        name: 'Download document',
                        value: 'downloadDocument',
                        action: 'Download a document',
                        description: 'Download a document',
                    },
                    {
                        name: 'Download documents',
                        value: 'downloadDocuments',
                        action: 'Download a list of documents',
                        description: 'Download a list of documents',
                    },
                    {
                        name: 'List documents',
                        value: 'listDocuments',
                        action: 'List documents',
                        description: 'List documents',
                    },
                    {
                        name: 'Extract attachments',
                        value: 'extractAttachments',
                        action: "Extract a document's attachments",
                        description: "Extract a document's attachments",
                    },
                    {
                        name: 'Replace image links',
                        value: 'replaceImageLinks',
                        action: "Replace image links with downloaded attachment paths",
                        description: "Replace image links with downloaded attachment paths",
                    },
                    {
                        name: 'Download attachments',
                        value: 'downloadAttachments',
                        action: "Download a document's attachments",
                        description: "Download a document's attachments",
                    },
                    {
                        name: 'Fix markdown export',
                        value: 'fixMarkdownExport',
                        action: 'Fix some markdown export issues for pandoc',
                        description: 'Fix some markdown export issues for pandoc',
                    },
                ],
                displayOptions: {
                    show: {
                        resource: ['document'],
                    },
                },
                default: 'downloadDocument',
                description: 'Operation to perform',
                noDataExpression: true,
            },
            {
                displayName: 'Document ID',
                name: 'documentId',
                type: 'string',
                required: true,
                description: 'The identifier of the document',
                default: '',
                placeholder: '6M1Qk4b2gk',
                displayOptions: {
                    show: {
                        resource: ['document'],
                        operation: ['downloadDocument'],
                    },
                },
            },
            {
                displayName: 'Parent Document ID',
                name: 'parentDocumentId',
                type: 'string',
                required: false,
                description: 'The identifier of the parent document (uuid)',
                default: '',
                placeholder: '314b1a77-c1f9-4fb8-8159-3646acb2a213',
                displayOptions: {
                    show: {
                        resource: ['document'],
                        operation: ['listDocuments'],
                    },
                },
            },
            {
                displayName: 'Limit',
                name: 'limit',
                type: 'number',
                required: false,
                description: 'The max. number of documents to fetch',
                default: '15',
                displayOptions: {
                    show: {
                        resource: ['document'],
                        operation: ['listDocuments'],
                    },
                },
            },
            {
                displayName: 'File Prefix',
                name: 'filePrefix',
                type: 'string',
                required: true,
                description: 'Prefix for the filename',
                default: 'attachments/',
                displayOptions: {
                    show: {
                        resource: ['document'],
                        operation: ['downloadAttachments'],
                    },
                },
            },
            {
                displayName: 'Fix slash',
                name: 'fixSlashOnEmptyLine',
                type: 'boolean',
                required: false,
                description: 'Remove slash on empty line',
                default: true,
                displayOptions: {
                    show: {
                        resource: ['document'],
                        operation: ['fixMarkdownExport'],
                    },
                },
            },
            {
                displayName: 'Fix citation',
                name: 'fixSquareBracketCitations',
                type: 'boolean',
                required: false,
                description: 'Remove backslash before square brackets with citations',
                default: true,
                displayOptions: {
                    show: {
                        resource: ['document'],
                        operation: ['fixMarkdownExport'],
                    },
                },
            },
        ],
    };
    // The execute method will go here
    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        return router.call(this);
    }
}
