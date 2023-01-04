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
                        name: 'Download',
                        value: 'download',
                        action: 'Download a document',
                        description: 'Download a document',
                    },
                    {
                        name: 'Download attachments',
                        value: 'downloadAttachments',
                        action: 'Download a documents attachments',
                        description: 'Download a documents attachments',
                    },
                ],
                displayOptions: {
                    show: {
                        resource: ['document'],
                    },
                },
                default: 'download',
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
                        operation: ['download'],
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
