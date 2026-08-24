export async function GET() {
  return Response.json(
    {
      status: "ok",
      service: "next",
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
    },
  );
}
