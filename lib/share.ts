/** WhatsApp share deep link generator */
export function getWhatsAppShareUrl(state: string, date: string, appUrl = "https://voteready.app") {
  const text = `I'm 100% VoteReady for ${state} elections on ${date}! Check your readiness at ${appUrl}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

/** Generate .ics calendar file for election date */
export function generateICSFile(state: string, date: string): string {
  const eventDate = new Date(date);
  const year = eventDate.getFullYear();
  const month = String(eventDate.getMonth() + 1).padStart(2, "0");
  const day = String(eventDate.getDate()).padStart(2, "0");
  const dateStr = `${year}${month}${day}`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//VoteReady//EN",
    "BEGIN:VEVENT",
    `DTSTART:${dateStr}T013000Z`,
    `DTEND:${dateStr}T123000Z`,
    `SUMMARY:Polling Day — ${state} State Elections`,
    `DESCRIPTION:Cast your vote! Booth opens 7 AM — 6 PM. Carry your photo ID. Voter Helpline: 1950`,
    "LOCATION:Your assigned polling booth",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadICS(state: string, date: string) {
  const ics = generateICSFile(state, date);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `election-${state.toLowerCase().replace(/\s+/g, "-")}.ics`;
  link.click();
  URL.revokeObjectURL(url);
}
