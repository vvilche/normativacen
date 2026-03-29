export interface XapiStatement {
  actor: {
    name?: string;
    mbox?: string;
  };
  verb: {
    id: string;
    display?: Record<string, string>;
  };
  object: {
    id: string;
    definition?: Record<string, any>;
  };
  result?: Record<string, any>;
  context?: Record<string, any>;
}

const XAPI_ENDPOINT = process.env.NEXT_PUBLIC_XAPI_ENDPOINT;
const XAPI_AUTH = process.env.NEXT_PUBLIC_XAPI_AUTH;

export async function sendXapiStatement(statement: XapiStatement): Promise<boolean> {
  if (!XAPI_ENDPOINT) {
    console.warn("xAPI endpoint no configurado (NEXT_PUBLIC_XAPI_ENDPOINT)");
    return false;
  }

  try {
    const response = await fetch(XAPI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(XAPI_AUTH ? { Authorization: XAPI_AUTH } : {}),
      },
      body: JSON.stringify(statement),
    });

    if (!response.ok) {
      console.error("xAPI payload rechazado", await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error enviando xAPI statement", error);
    return false;
  }
}
