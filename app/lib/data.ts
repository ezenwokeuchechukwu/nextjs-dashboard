// app/lib/data.ts
import clientPromise from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';

const ITEMS_PER_PAGE = 10;

// --------------------------
// Invoices
// --------------------------

// Fetch invoices for a given page and optional search query
export async function fetchInvoices(query = '', page = 1) {
  const client = await clientPromise;
  const db = client.db("nextDB");

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
  const db = client.db("nextDB");

  const filter = query
    ? { customer_name: { $regex: query, $options: 'i' } }
    : {};

  const totalCount = await db.collection('invoices').countDocuments(filter);
  return Math.ceil(totalCount / ITEMS_PER_PAGE);
}

// Fetch a single invoice by ID
export async function fetchInvoiceById(id: string) {
  const client = await clientPromise;
  const db = client.db("nextDB");

  return await db.collection('invoices').findOne({ _id: new ObjectId(id) });
}

// Fetch filtered invoices for table (optional extra filtering logic)
export async function fetchFilteredInvoices(filter: any = {}, page = 1) {
  const client = await clientPromise;
  const db = client.db("nextDB");

  const invoices = await db
    .collection('invoices')
    .find(filter)
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
    .toArray();

  return invoices;
}

// Fetch latest invoices
export async function fetchLatestInvoices(limit = 5) {
  const client = await clientPromise;
  const db = client.db("nextDB");

  return await db.collection('invoices')
    .find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
}

// Fetch revenue (for dashboard chart)
export async function fetchRevenue() {
  const client = await clientPromise;
  const db = client.db("nextDB");

  const revenueAgg = await db.collection('invoices').aggregate([
    {
      $group: {
        _id: { $month: "$createdAt" },
        total: { $sum: "$amount" }
      }
    }
  ]).toArray();

  return revenueAgg;
}

// --------------------------
// Customers
// --------------------------

// Fetch all customers
export async function fetchCustomers() {
  const client = await clientPromise;
  const db = client.db("nextDB");

  return await db.collection('customers').find({}).toArray();
}

// --------------------------
// Dashboard cards
// --------------------------

// Fetch data for dashboard cards
export async function fetchCardData() {
  const client = await clientPromise;
  const db = client.db("nextDB");

  const totalInvoices = await db.collection('invoices').countDocuments();
  const totalRevenueAgg = await db.collection('invoices').aggregate([
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]).toArray();
  const totalRevenue = totalRevenueAgg[0]?.total || 0;

  return { totalInvoices, totalRevenue };
}
