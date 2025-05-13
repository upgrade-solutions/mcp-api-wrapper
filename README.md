# mcp-api-wrapper

This project is an example [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) server built as a wrapper of an existing API. In essence, the MCP server is mounted on an endpoint (e.g. `/mcp`) and registered tools (on the `server` object) are made available to MCP hosts/clients. 

```javascript
// index.ts
app.post('/mcp', async (req: Request, res: Response) => {
  try {
    const transport: StreamableHTTPServerTransport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
    ...

// mcp-server.ts
server.tool(
  'create_ticket',
  'Creates a new support ticket',
  {
    customer_email: z.string().describe('Customer email address'),
    customer_name: z.string().describe('Customer name'),
    issue_message: z.string().describe('Customer message'),
    issue_type: z.enum(['bug', 'feature_request', 'other']).describe('Type of issue'),
  }
  ...
```

## Quick Start

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run the dev server
npm run dev
```

## MCP Client Connection
To connect Claude to the MCP-wrapped API, add the server to the `claude_desktop_config.json` file. 

```json
{
  "mcpServers": {
    "mcp-api-wrapper": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "http://localhost:3000/mcp"
      ]
    }
  }
}
```

Now you should be able to prompt Claude with a request to create a support ticket and it will execute the action on the API via MCP.

> Could you create a ticket for Mark Evans (mark@example.com)? He's encountering a bug where the password reset flow is failing.