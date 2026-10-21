// Send visitors on the old pages.dev address or www to the main domain.
export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  if (url.hostname === "foster-3d-tours.pages.dev" || url.hostname === "www.foster3dtours.com") {
    url.hostname = "foster3dtours.com";
    return Response.redirect(url.toString(), 301);
  }
  return next();
}
