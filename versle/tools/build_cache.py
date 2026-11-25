import json,os,re,html
from songs import SONGS
def text_of(d):
    h=d.get("parse",{}).get("text",{}).get("*","")
    h=re.sub(r"<(style|script|table|sup)[^>]*>.*?</\1>","",h,flags=re.S)
    h=re.sub(r"<br\s*/?>","\n",h); h=re.sub(r"</(p|div|dd|li)>","\n\n",h)
    return html.unescape(re.sub(r"<[^>]+>","",h))
BAD=re.compile(r"[\[\]©|{}]|wikisource|public domain|copyright|retrieved|written (by|in)|published|composed|tune|translated|^\W*(chorus|verse|refrain)\b",re.I)
def stanza(t):
    for b in [b.strip() for b in re.split(r"\n\s*\n",t) if b.strip()]:
        if BAD.search(b): continue
        w=re.sub(r"[“”\"]","",re.sub(r"\s+"," ",b)).split()
        if 14<=len(w)<=70: return " ".join(w[:36])
out=[];miss=[]
for t,o,p in SONGS:
    f="cache/"+"".join(c if c.isalnum() else "_" for c in p)+".json"
    if not os.path.exists(f): miss.append(t+" (not fetched)"); continue
    v=stanza(text_of(json.load(open(f))))
    (out.append([t,o,v]) if v else miss.append(t+" (no verse found)"))
open("../data.js","w").write("window.VERSLE="+json.dumps(out,ensure_ascii=False,indent=0)+";\n")
print(len(out),"songs;",len(miss),"missing")
for m in miss: print(" -",m)
