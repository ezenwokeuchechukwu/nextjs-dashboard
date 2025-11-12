// app/lib/data.ts
import clientPromise from '@/app/lib/mongodb';

const ITEMS_PER_PAGE = 10;

// Fetch invoices for a given page and optional search query
export async function fetchInvoices(query = '', page = 1) {
  const client = await clientPromise;
  const db = client.db("nextDBs");

  const filter = query
    ? { customer_name: { $regex: query, $options: 'i' } }
    : {};

  const invoices = await db
    .collection('invoices')
    .find(filter)
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
    .toArray();

  return invoices;
}

// Fetch total pages for pagination based on search query
export async function fetchInvoicesPages(query = '') {
  const client = await clientPromise;
  const db = client.db("nextDBs");

  const filter = query
    ? { customer_name: { $regex: query, $options: 'i' } }
    : {};

  const totalCount = await db.collection('invoices').countDocuments(filter);
  return Math.ceil(totalCount / ITEMS_PER_PAGE);
}
