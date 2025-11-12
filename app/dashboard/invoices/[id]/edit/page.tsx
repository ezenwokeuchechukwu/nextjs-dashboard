// app/dashboard/invoices/[id]/edit/page.tsx
import React from 'react';
import { ObjectId } from 'mongodb';
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
// Simple server-side Form component to avoid external import errors
function Form({
  invoice,
  customers,
}: {
  invoice: InvoiceForm;
  customers: Array<{ _id?: string; id?: string; name: string }>;
}) {
  return (
    <form action={`/dashboard/invoices/${invoice.id}/edit`} method="post" className="space-y-4">
      <div>
        <label htmlFor="customer_id" className="block text-sm font-medium text-gray-700">Customer</label>
        <select id="customer_id" name="customer_id" title="Customer" defaultValue={invoice.customer_id} className="mt-1 block w-full">
          {customers.map((c) => (
            <option key={c._id ?? c.id} value={c._id ?? c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
        <input
          id="status"
          name="status"
          title="Status"
          placeholder="Enter status"
          defaultValue={invoice.status}
          className="mt-1 block w-full"
        />
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
        <input
          id="amount"
          name="amount"
          type="number"
          title="Amount"
          placeholder="Enter amount"
          defaultValue={String(invoice.amount)}
          className="mt-1 block w-full"
        />
      </div>

      <div>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </form>
  );
}

// -------------------------
// Type Definitions
// -------------------------
export interface Invoice {
  _id: ObjectId;
  customerId: string;
  status: string;
  amount: number;
  createdAt: Date;
}

export interface InvoiceForm {
  id: string;
  customer_id: string;
  status: string;
  amount: number;
  createdAt: Date;
}

// -------------------------
// Page Component
// -------------------------
interface EditInvoicePageProps {
  params: { id: string };
}

export default async function EditInvoicePage({ params }: EditInvoicePageProps) {
  // Fetch data
  const invoiceData = await fetchInvoiceById(params.id);
  if (!invoiceData) throw new Error('Invoice not found');

  const customers = await fetchCustomers();
  if (!customers) throw new Error('Failed to fetch all customers');

  // Normalize customer IDs to strings for the Form component
  const customersForForm = customers.map((c) => ({
    _id: c._id ? String(c._id) : c.id,
    id: c.id ?? (c._id ? String(c._id) : undefined),
    name: c.name,
  }));

  // Map DB invoice to form type
  const invoice: InvoiceForm = {
    id: invoiceData._id.toString(),
    customer_id: invoiceData.customerId,
    status: invoiceData.status,
    amount: invoiceData.amount,
    createdAt: invoiceData.createdAt,
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Invoice</h1>
      <Form invoice={invoice} customers={customersForForm} />
    </main>
  );
}
