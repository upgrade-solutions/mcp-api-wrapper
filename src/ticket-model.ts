interface Ticket {
  customer_email: string;
  customer_name: string;
  issue_message: string;
  issue_type: 'bug' | 'feature_request' | 'other';
  status?: 'open' | 'closed';
  created_at?: Date;
}

const createTicket = async (ticketData: Ticket) => {
  return ticketData;
};

export { createTicket };