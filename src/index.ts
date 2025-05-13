import express, { Request, Response } from 'express';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamablehttp.js';
import { server } from './mcp-server.js';
import { createTicket } from './ticket-model.js';

const app = express();
app.use(express.json());

// Expose the MCP server over HTTP
app.post('/mcp', async (req: Request, res: Response) => {
  try {
    const transport: StreamableHTTPServerTransport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);

    res.on('close', () => {
      console.log('Request closed');
      transport.close();
    });
  } catch (error) {
    console.error('Error handling MCP request:', error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: 'Internal server error',
        },
        id: null,
      });
    }
  }
});

// Create ticket through POST request
app.post('/tickets', async (req: Request, res: Response) => {
  try {
    const { customer_email, customer_name, issue_message, issue_type } = req.body;
    const ticket = await createTicket({
      customer_email,
      customer_name,
      issue_message,
      issue_type,
    });
    res.status(201).json({
      message: 'Ticket created successfully',
      data: ticket,
    });
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ message: 'Failed to create ticket' });
  }
});

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Customer Support server listening on port ${PORT}`);
});