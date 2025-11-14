// pages/dashboard/invoices/create/page.tsx
import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Invoice',
};

// Tell Next.js to render this page at runtime instead of static
export const revalidate = 0; // or export const dynamic = 'force-dynamic';

export default async function Page() {
  let customers: Awaited<ReturnType<typeof fetchCustomers>>;
  try {
    customers = await fetchCustomers(); // fetch from Supabase / remote DB
  } catch (err) {
    console.error('Failed to fetch customers:', err);
    // Provide a typed fallback to satisfy the declared type
    customers = [] as unknown as Awaited<ReturnType<typeof fetchCustomers>>;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          { label: 'Create Invoice', href: '/dashboard/invoices/create', active: true },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}
