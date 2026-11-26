import json,os,re,sys,time,urllib.request,urllib.parse,html
from songs import SONGS
os.makedirs("cache2",exist_ok=True)
SKIP=re.compile(r"^(Help|Author|Portal|Special|Category|Wikisource|File|Template|Index|Page|Talk):")
def get(page):
    f="cache2/"+re.sub(r"\W","_",page)[:120]+".json"
    if os.path.exists(f): return json.load(open(f))
    for wait in (0,20,60,120):
        time.sleep(wait)
        try:
            q=urllib.parse.urlencode(dict(action="parse",page=page,prop="text",redirects=1,disablelimitreport=1,format="json"))
            req=urllib.request.Request("https://en.wikisource.org/w/api.php?"+q,headers={"User-Agent":"versle-builder/0.1 (hobby game; python-urllib)"})
            d=json.load(urllib.request.urlopen(req,timeout=30)); open(f,"w").write(json.dumps(d)); time.sleep(8); return d
        except Exception as e:
            print("retry",page,str(e)[:60],flush=True)
            if "404" in str(e): break
    return {}
def poem(d):
    h=d.get("parse",{}).get("text",{}).get("*","")
    m=re.search(r'<div class="poem">(.*?)</div>',h,re.S)
    if not m: return None
    t=re.sub(r"<br\s*/?>","\n",m.group(1)); t=html.unescape(re.sub(r"<[^>]+>","",t))
    return t.strip()
def links(d):
    h=d.get("parse",{}).get("text",{}).get("*","")
    body=h[h.find("wst-header-mainblock"):]
    out=[]
    for l in re.findall(r'href="/wiki/([^"#]+)"',body):
        l=urllib.parse.unquote(l)
        if not SKIP.match(l) and l not in out: out.append(l)
    return out
result={}
for title,origin,page in SONGS:
    d=get(page)
    if not d: print("skip",title,flush=True); continue
    p=poem(d); src=page
    if not p:
        for l in links(d)[:4]:
            p=poem(get(l)); src=l
            if p: break
    if p:
        result[title]=dict(origin=origin,src=src,poem=p); print("ok",title,flush=True)
    else: print("nopoem",title,flush=True)
json.dump(result,open("poems.json","w"))
print("done",len(result),flush=True)
