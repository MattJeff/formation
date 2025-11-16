import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Vérifier si les variables existent
    const hasUrl = !!url;
    const hasServiceKey = !!serviceKey;
    const serviceKeyPrefix = serviceKey ? serviceKey.substring(0, 20) + '...' : 'MISSING';

    // Tester la connexion si la clé existe
    let canConnect = false;
    let testError = null;

    if (hasUrl && hasServiceKey) {
      try {
        const supabase = createClient(url, serviceKey);
        const { data, error } = await supabase.from('courses').select('id').limit(1);
        canConnect = !error;
        testError = error?.message || null;
      } catch (e: any) {
        testError = e.message;
      }
    }

    return NextResponse.json({
      hasUrl,
      hasServiceKey,
      serviceKeyPrefix,
      canConnect,
      testError,
      url: url || 'MISSING',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
