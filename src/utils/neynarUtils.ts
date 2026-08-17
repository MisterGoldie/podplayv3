const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;

type UserData = {
  username: string;
  pfp: string;
};

type NeynarUser = {
  username?: string;
  pfp_url?: string;
};

type NeynarBulkResponse = {
  users?: NeynarUser[];
};

export async function fetchUserDataByFid(fid: string): Promise<UserData | null> {
  if (!NEYNAR_API_KEY) {
    console.warn("NEYNAR_API_KEY is not defined");
    return null;
  }

  try {
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
      {
        headers: {
          accept: "application/json",
          api_key: NEYNAR_API_KEY,
        },
      }
    );

    if (!response.ok) {
      console.error("Neynar user lookup failed:", response.status);
      return null;
    }

    const data = (await response.json()) as NeynarBulkResponse;
    const user = data.users?.[0];
    if (!user) return null;

    return {
      username: user.username || `fid:${fid}`,
      pfp: user.pfp_url || "/default-avatar.png",
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}
