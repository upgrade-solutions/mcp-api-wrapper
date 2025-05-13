import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createTicket } from './ticket-model.js'; // Assuming you have a ticketService module

const initialize = () => {
  // Create an MCP server with implementation details
  const server = new McpServer({
    name: 'customer-support',
    version: '1.0.0',
  }, { capabilities: { logging: {} } });

  // Register a tool specifically for testing resumability
  server.tool(
    'create_ticket',
    'Creates a new support ticket',
    {
      customer_email: z.string().describe('Customer email address'),
      customer_name: z.string().describe('Customer name'),
      issue_message: z.string().describe('Customer message'),
      issue_type: z.enum(['bug', 'feature_request', 'other']).describe('Type of issue'),
    },
    async ({ customer_email, customer_name, issue_message, issue_type }) => {
      const ticket = {
        customer_email,
        customer_name,
        issue_message,
        issue_type
      };
      await createTicket(ticket);
      return {
        content: [{ type: "text", text: `Ticket created for ${customer_name} (${customer_email}).` }],
      };
    }
  );
  return server;
}

// Export the server instance
export const server = initialize();