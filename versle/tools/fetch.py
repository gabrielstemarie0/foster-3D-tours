import json,os,sys,time,urllib.request,urllib.parse
from songs import SONGS
os.makedirs("cache",exist_ok=True)
for t,o,p in SONGS:
    f="cache/"+"".join(c if c.isalnum() else "_" for c in p)+".json"
    if os.path.exists(f): continue
    for wait in (0,20,60,120):
        time.sleep(wait)
        try:
            q=urllib.parse.urlencode(dict(action="parse",page=p,prop="text",redirects=1,disablelimitreport=1,format="json"))
            req=urllib.request.Request("https://en.wikisource.org/w/api.php?"+q,headers={"User-Agent":"versle-builder/0.1 (hobby game; python-urllib)"})
            d=json.load(urllib.request.urlopen(req,timeout=30))
            open(f,"w").write(json.dumps(d)); print("ok",t,flush=True); break
        except Exception as e: print("retry",t,e,flush=True)
    time.sleep(8)
print("done")
