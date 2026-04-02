import { headers } from 'next/headers';

export const getBaseUrl = async () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  
  const headerList = await headers();
  const host = headerList.get('host');
  
  if (host && !host.includes('localhost')) {
    return `https://${host}/_/backend`;
  }
  
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/_/backend`;
  }
  
  return 'http://localhost:5000';
};
