import json,re,sys,time,urllib.request,urllib.parse
# (display title, origin, Wikisource page title)
SONGS=[
("Amazing Grace","John Newton","Olney Hymns (1840)/Book 1/Hymn 41"),
("Jingle Bells","James Pierpont","Jingle Bells"),
("The Star-Spangled Banner","Francis Scott Key","The Star-Spangled Banner"),
("America the Beautiful","Katharine Lee Bates","America the Beautiful"),
("Auld Lang Syne","Robert Burns","Auld Lang Syne"),
("Danny Boy","Fred Weatherly","Danny Boy"),
("Oh! Susanna","Stephen Foster","Oh! Susanna"),
]
def api(**p):
    p["format"]="json"
    for wait in (0,5,15,30):
        time.sleep(wait)
        try:
            req=urllib.request.Request("https://en.wikisource.org/w/api.php?"+urllib.parse.urlencode(p),headers={"User-Agent":"versle-builder/0.1 (hobby game; python-urllib)"})
            return json.load(urllib.request.urlopen(req,timeout=30))
        except Exception as e: print("retry",e,file=sys.stderr)
    raise SystemExit("gave up")
import html
def page_text(page):
    r=api(action="parse",page=page,prop="text",redirects=1,disablelimitreport=1)
    h=r.get("parse",{}).get("text",{}).get("*","")
    h=re.sub(r"<(style|script|table|sup)[^>]*>.*?</\\1>","",h,flags=re.S)
    h=re.sub(r"<br\\s*/?>","\\n",h); h=re.sub(r"</(p|div|dd|li)>","\\n\\n",h)
    h=re.sub(r"<[^>]+>","",h)
    return html.unescape(h)
def first_stanza(t):
    blocks=[b.strip() for b in re.split(r"\n\s*\n",t) if b.strip()]
    for b in blocks:
        lines=[l.strip() for l in b.split("\n") if l.strip()]
        if len(lines)<3 or len(lines)>10: continue
        if any(len(l.split())>14 for l in lines): continue
        if any(re.search(r"[:\[\]©]|^(by|from|written)\b",l,re.I) for l in lines): continue
        words=re.sub(r"[“”\"]","",re.sub(r"\s+"," "," ".join(lines))).split()
        if 14<=len(words): return " ".join(words[:36])
    return None
out=[];report=[]
for title,origin,page in SONGS:
    time.sleep(2)
    v=first_stanza(page_text(page))
    report.append((title,bool(v),len(v.split()) if v else 0))
    if v: out.append([title,origin,v])
open("../data.js","w").write("window.VERSLE="+json.dumps(out,ensure_ascii=False,indent=0)+";\n")
for r_ in report: print(r_)
