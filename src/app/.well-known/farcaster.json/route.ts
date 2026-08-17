export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL || "https://podplayv3.vercel.app";

  const config = {
    accountAssociation: {
      header:
        "eyJmaWQiOjEwOTkxNzksInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHg5YmEyMjgwNmNEOEY2NTEzMUU1YWQwMEUwMTdGQjhCMUFlM0EyZmFBIn0",
      payload: "eyJkb21haW4iOiJwb2RwbGF5djIudmVyY2VsLmFwcCJ9",
      signature:
        "MHhiMDE3YWJiYTNkZTE4NjJmODMxMDFmY2FmYWNjNjdiM2UxOTI1Mjk0NTU1ZjBlMzM5ODNmODM1MWQxMWYwOWJmN2YxNzU2NzExY2YzNWRlMTgxNWMzMzAyN2Y4MmU1OWU1NWQ1MTdjYjA3MDA5ZWY0MjgwNTg0NTRkMWJjYmRlNjFj",
    },
    baseBuilder: {
      allowedAddresses: ["0x389355CBa617EA0b305e5105DC483251c80960d1"]
    },
    frame: {
      version: "0.0.0",
      name: "POD Play v3",
      iconUrl: `${appUrl}/icon.png`,
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#1A0B2E",
      homeUrl: appUrl,
      webhookUrl: `${appUrl}/api/webhook`,
    },
  };

  return Response.json(config);
}
////