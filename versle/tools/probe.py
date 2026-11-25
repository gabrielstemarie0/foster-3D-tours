import json,sys,time,urllib.request,urllib.parse
def api(**p):
    p["format"]="json"
    for wait in (0,5,15,30):
        time.sleep(wait)
        try:
            req=urllib.request.Request("https://en.wikisource.org/w/api.php?"+urllib.parse.urlencode(p),headers={"User-Agent":"versle-builder/0.1 (hobby game; python-urllib)"})
            return json.load(urllib.request.urlopen(req,timeout=30))
        except Exception as e: print("retry",e)
    raise SystemExit("gave up")
r=api(action="query",titles="|".join(sys.argv[1:]),redirects=1)
for pg in r["query"]["pages"].values(): print(pg.get("title"),"MISSING" if "missing" in pg else "ok")
