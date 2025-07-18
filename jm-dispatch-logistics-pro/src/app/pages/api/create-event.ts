import type { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token, title, date, description } = req.body;

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: token });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const event = {
    summary: title,
    description,
    start: { dateTime: date },
    end: { dateTime: new Date(new Date(date).getTime() + 60 * 60 * 1000).toISOString() },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });

    return res.status(200).json({ success: true, link: response.data.htmlLink });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Échec ajout à Google Calendar" });
  }
}
