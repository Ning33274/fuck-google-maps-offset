function b64urlToB64(s) {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  return s;
}

function b64ToB64url(s) {
  return s.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function replaceAll(input, from, to) {
  return input.split(from).join(to);
}

let url = $request.url;
let headers = $request.headers;

try {
  let u = new URL(url);

  if (
    u.hostname === "mobilemaps.googleapis.com" &&
    u.pathname === "/maps/vt/proto" &&
    u.searchParams.has("bpb")
  ) {
    let raw = atob(b64urlToB64(u.searchParams.get("bpb")));

    raw = replaceAll(raw, "zh-Hans-TW", "zh-Hans-CN");
    raw = replaceAll(raw, "HK", "CN");

    u.searchParams.set("bpb", b64ToB64url(btoa(raw)));

    headers["Accept-Language"] = "zh-CN,zh-Hans;q=0.9,en;q=0.8";

    url = u.toString();
  }
} catch (e) {
  console.log("Google Maps iOS CN BPB error: " + e);
}

$done({
  url,
  headers
});
