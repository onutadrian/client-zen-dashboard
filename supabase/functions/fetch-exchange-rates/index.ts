
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching exchange rates from currencylayer API...');
    
    const apiKey = Deno.env.get('CURRENCYLAYER_API_KEY');
    if (!apiKey) {
      console.error('CURRENCYLAYER_API_KEY not configured');
      throw new Error('API key not configured');
    }

    // Use the correct currencylayer API endpoint
    const response = await fetch(`https://api.currencylayer.com/live?access_key=${apiKey}&source=EUR&currencies=USD,RON,GBP`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Response Error:', response.status, errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      console.error('API Error Response:', data);
      throw new Error(`API request failed: ${data.error?.info || JSON.stringify(data)}`);
    }
    
    console.log('Successfully fetched exchange rates:', data);
    
    // Format the rates into our expected structure
    // The API returns rates relative to EUR, so we need to calculate cross-rates
    const eurToUsd = data.quotes.EURUSD;
    const eurToRon = data.quotes.EURRON;
    const eurToGbp = data.quotes.EURGBP || 0.85; // Fallback if GBP not available
    
    const rates = {
      EUR: {
        EUR: 1,
        USD: eurToUsd,
        RON: eurToRon,
        GBP: eurToGbp
      },
      USD: {
        EUR: 1 / eurToUsd,
        USD: 1,
        RON: eurToRon / eurToUsd,
        GBP: eurToGbp / eurToUsd
      },
      RON: {
        EUR: 1 / eurToRon,
        USD: eurToUsd / eurToRon,
        RON: 1,
        GBP: eurToGbp / eurToRon
      },
      GBP: {
        EUR: 1 / eurToGbp,
        USD: eurToUsd / eurToGbp,
        RON: eurToRon / eurToGbp,
        GBP: 1
      }
    };
    
    return new Response(JSON.stringify({ 
      success: true, 
      rates,
      timestamp: data.timestamp 
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
