export type GuestbookEntry = {
  id: string;
  display_name: string;
  message: string;
  created_at: string;
};

export function formatKoreanDate(value: string): string {
  return new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium" }).format(new Date(value));
}
