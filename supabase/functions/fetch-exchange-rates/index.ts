
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BNR_RATES_URL = 'https://curs.bnr.ro/nbrfxrates.xml';
const SUPPORTED_CURRENCIES = ['RON', 'EUR', 'USD', 'GBP'];

const parseBnrRates = (xml: string) => {
  const cubeDate = xml.match(/<Cube[^>]*date="([^"]+)"/)?.[1] ?? null;
  const ronPerUnit: Record<string, number> = { RON: 1 };
  const ratePattern = /<Rate\s+([^>]*)>([^<]+)<\/Rate>/g;
  let match: RegExpExecArray | null;

  while ((match = ratePattern.exec(xml)) !== null) {
    const attributes = match[1];
    const rawValue = match[2].trim().replace(',', '.');
    const currency = attributes.match(/currency="([^"]+)"/)?.[1];
    const multiplier = Number(attributes.match(/multiplier="([^"]+)"/)?.[1] ?? '1');
    const value = Number(rawValue);

    if (!currency || !Number.isFinite(value) || !Number.isFinite(multiplier) || multiplier <= 0) {
      continue;
    }

    ronPerUnit[currency] = value / multiplier;
  }

  const missingCurrencies = SUPPORTED_CURRENCIES.filter(currency => !ronPerUnit[currency]);
  if (missingCurrencies.length > 0) {
    throw new Error(`BNR feed missing currencies: ${missingCurrencies.join(', ')}`);
  }

  const rates = SUPPORTED_CURRENCIES.reduce<Record<string, Record<string, number>>>((matrix, fromCurrency) => {
    matrix[fromCurrency] = SUPPORTED_CURRENCIES.reduce<Record<string, number>>((row, toCurrency) => {
      row[toCurrency] = ronPerUnit[fromCurrency] / ronPerUnit[toCurrency];
      return row;
    }, {});

    return matrix;
  }, {});

  return { rates, sourceDate: cubeDate };
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching exchange rates from BNR XML feed...');
    const response = await fetch(BNR_RATES_URL);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('BNR feed response error:', response.status, errorText);
      throw new Error(`BNR feed request failed with status ${response.status}: ${errorText}`);
    }

    const xml = await response.text();
    const { rates, sourceDate } = parseBnrRates(xml);
    
    return new Response(JSON.stringify({ 
      success: true, 
      rates,
      source: 'BNR',
      sourceDate,
      fetchedAt: new Date().toISOString()
    }), {
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders 
      },
    });
  } catch (error) {
    console.error('Error in fetch-exchange-rates function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json', 
        ...corsHeaders 
      },
    });
  }
});
