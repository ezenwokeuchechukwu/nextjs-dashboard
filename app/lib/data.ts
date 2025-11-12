// app/lib/data.ts
import clientPromise from '@/app/lib/mongodb';
import { ObjectId, Filter, Document } from 'mongodb';

const ITEMS_PER_PAGE = 10;

// --------------------------
// Types
// --------------------------
export type Invoice = {
  _id: ObjectId;
  customer_name: string;
  amount: number;
  createdAt: Date;
  status?: string;
  customer_id?: ObjectId;
};

export type Customer = {
  _id: ObjectId;
  name: string;
  email?: string;
  phone?: string;
};

// --------------------------
// Invoices
// --------------------------

export async function fetchInvoices(query = '', page = 1): Promise<Invoice[]> {
  const client = await clientPromise;
  const db = client.db("nextDB");

  const filter: Filter<Invoice> = query
    ? { customer_name: { $regex: query, $options: 'i' } }
    : {};

  return db.collection<Invoice>('invoices')
    .find(filter)
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
    .toArray();
}

export async function fetchInvoicesPages(query = ''): Promise<number> {
  const client = await clientPromise;
  const db = client.db("nextDB");

  const filter: Filter<Invoice> = query
    ? { customer_name: { $regex: query, $options: 'i' } }
    : {};

  const totalCount = await db.collection<Invoice>('invoices').countDocuments(filter);
  return Math.ceil(totalCount / ITEMS_PER_PAGE);
}

export async function fetchInvoiceById(id: string): Promise<Invoice | null> {
  const client = await clientPromise;
  const db = client.db("nextDB");

  return db.collection<Invoice>('invoices').findOne({ _id: new ObjectId(id) });
}

export async function fetchFilteredInvoices(filter: Filter<Invoice> = {}, page = 1): Promise<Invoice[]> {
  const client = await clientPromise;
  const db = client.db("nextDB");

  return db.collection<Invoice>('invoices')
    .find(filter)
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
    .toArray();
}

export async function fetchLatestInvoices(limit = 5): Promise<Invoice[]> {
  const client = await clientPromise;
  const db = client.db("nextDB");

  return db.collection<Invoice>('invoices')
    .find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
}

export async function fetchRevenue(): Promise<{ _id: number; total: number }[]> {
  const client = await clientPromise;
  const db = client.db("nextDB");

  return db.collection<Invoice>('invoices')
    .aggregate<{ _id: number; total: number }>([
      { $group: { _id: { $month: "$createdAt" }, total: { $sum: "$amount" } } }
    ])
    .toArray()
    .then(results => results.map(r => ({ _id: r._id as unknown as number, total: r.total })));
}

// --------------------------
// Customers
// --------------------------

export async function fetchCustomers(): Promise<Customer[]> {
  const client = await clientPromise;
  const db = client.db("nextDB");

  return db.collection<Customer>('customers').find({}).toArray();
}

// --------------------------
// Dashboard cards
// --------------------------

export async function fetchCardData(): Promise<{ totalInvoices: number; totalRevenue: number }> {
  const client = await clientPromise;
  const db = client.db("nextDB");

  const totalInvoices = await db.collection<Invoice>('invoices').countDocuments();
  const totalRevenueAgg = await db.collection<Invoice>('invoices')
    .aggregate<{ _id: null; total: number }>([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ])
    .toArray();

  const totalRevenue = totalRevenueAgg[0]?.total ?? 0;
  return { totalInvoices, totalRevenue };
}
