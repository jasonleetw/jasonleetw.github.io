function get_radar() {
  const t = Math.floor(Date.now() / 1000);
  const unixTimestamp = (Math.floor(t / 60 / 10) - 1) * 10 * 60;
  const localTime = new Date(unixTimestamp * 1000);
  const result = localTime
    .toLocaleString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })
    .replace(/[/:\s]/g, "");
  url = "https://www.cwa.gov.tw/Data/radar/CV1_1000_" + result + ".png";
  return url;
}
