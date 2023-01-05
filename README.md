# n8n-nodes-outline-wiki

This is an n8n community node. It lets you use [outline](https://github.com/outline/outline) in your n8n workflows.

Outline is a fastest knowledge base for growing teams. Beautiful, realtime collaborative, feature packed, and markdown compatible.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)
[Compatibility](#compatibility)  
[Usage](#usage)
[Resources](#resources)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

- List documents
- Download documents (info)
- Extract image attachments from the Markdown text
- Download extracted attachments

## Credentials

To use this node, you need an API Token, which you can create in the settings of
your outline account.

When you run a self-hosted instance, you also need to set the URL.

## Compatibility

Initially, created for and tested with n8n version 0.209.4.

## Usage

Chain together a node downloading or listing a document / multiple documents,
another node extracting attachments, and a third downloading the attachments. To
upload to, e.g., an S3 bucket, use an itemList node to split the field
attachments into separate items and connect the S3 node after that.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Outline API documentation](https://www.getoutline.com/developers)

