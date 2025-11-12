// app/dashboard/invoices/create/page.tsx
import { fetchCustomers } from '@/app/lib/data';
import CreateInvoiceForm from '@/app/ui/invoices/create-form';
type CustomerField = {
  id: string;
  name: string;
};

export default async function CreateInvoicePage() {
  const rawCustomers = await fetchCustomers();

  const customers: CustomerField[] = rawCustomers.map((c: any) => ({
    id:
      typeof c._id === 'object' && c._id?.toString
        ? c._id.toString()
        : String(c.id ?? c._id ?? ''),
    name: c.name ?? '',
  }));

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create Invoice</h1>
      <CreateInvoiceForm customers={customers} />
    </div>
  );
}
