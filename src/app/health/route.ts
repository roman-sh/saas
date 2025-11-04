// AWS App Runner health checks require a 200 OK response.
// Adding a timestamp ensures the response is unique for each request,
// preventing any caching layers from returning a 304 Not Modified status,
// which would cause the health check to fail.
export async function GET() {
  return Response.json(
    { status: "healthy", timestamp: new Date().toISOString() },
    { status: 200 },
  )
}
