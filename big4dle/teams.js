// city|nickname|primary|secondary|accent[|p = pinstripes]
const TEAMS = {
  football: { label: "Football", emoji: "🏈", list: [
    "Arizona|Cardinals|97233F|FFFFFF|000000","Atlanta|Falcons|A71930|000000|A5ACAF","Baltimore|Ravens|241773|9E7C0C|000000",
    "Buffalo|Bills|00338D|C60C30|FFFFFF","Carolina|Panthers|0085CA|101820|BFC0BF","Chicago|Bears|0B162A|C83803|FFFFFF",
    "Cincinnati|Bengals|000000|FB4F14|FFFFFF","Cleveland|Browns|311D00|FF3C00|FFFFFF","Dallas|Cowboys|003594|869397|FFFFFF|w",
    "Denver|Broncos|FB4F14|002244|FFFFFF","Detroit|Lions|0076B6|B0B7BC|000000","Green Bay|Packers|203731|FFB612|FFFFFF",
    "Houston|Texans|03202F|A71930|FFFFFF","Indianapolis|Colts|002C5F|A2AAAD|FFFFFF","Jacksonville|Jaguars|101820|D7A22A|006778",
    "Kansas City|Chiefs|E31837|FFB81C|FFFFFF","Las Vegas|Raiders|000000|A5ACAF|FFFFFF","Los Angeles|Chargers|0080C6|FFC20E|FFFFFF",
    "Los Angeles|Rams|003594|FFA300|FFD100","Miami|Dolphins|008E97|FC4C02|005778","Minnesota|Vikings|4F2683|FFC62F|FFFFFF",
    "New England|Patriots|002244|C60C30|B0B7BC","New Orleans|Saints|101820|D3BC8D|FFFFFF","New York|Giants|0B2265|A71930|A5ACAF",
    "New York|Jets|125740|000000|FFFFFF","Philadelphia|Eagles|004C54|A5ACAF|000000","Pittsburgh|Steelers|101820|FFB612|FFFFFF",
    "San Francisco|49ers|AA0000|B3995D|FFFFFF","Seattle|Seahawks|002244|69BE28|A5ACAF","Tampa Bay|Buccaneers|D50A0A|34302B|FF7900",
    "Tennessee|Titans|4B92DB|0C2340|C8102E","Washington|Commanders|5A1414|FFB612|FFFFFF" ] },
  baseball: { label: "Baseball", emoji: "⚾", list: [
    "Arizona|Diamondbacks|A71930|E3D4AD|000000","Atlanta|Braves|13274F|CE1141|FFFFFF","Baltimore|Orioles|DF4601|000000|FFFFFF",
    "Boston|Red Sox|BD3039|0C2340|FFFFFF","Chicago|Cubs|0E3386|CC3433|FFFFFF|p","Chicago|White Sox|27251F|C4CED4|FFFFFF|p",
    "Cincinnati|Reds|C6011F|000000|FFFFFF","Cleveland|Guardians|00385D|E50022|FFFFFF","Colorado|Rockies|33006F|C4CED4|000000|p",
    "Detroit|Tigers|0C2340|FA4616|FFFFFF","Houston|Astros|002D62|EB6E1F|F4911E","Kansas City|Royals|004687|BD9B60|FFFFFF",
    "Los Angeles|Angels|BA0021|003263|C4CED4","Los Angeles|Dodgers|005A9C|EF3E42|FFFFFF","Miami|Marlins|00A3E0|EF3340|000000",
    "Milwaukee|Brewers|12284B|FFC52F|FFFFFF","Minnesota|Twins|002B5C|D31145|CFAB7A","New York|Mets|002D72|FF5910|FFFFFF|p",
    "New York|Yankees|0C2340|C4CED3|FFFFFF|p","Oakland|Athletics|003831|EFB21E|FFFFFF","Philadelphia|Phillies|E81828|002D72|FFFFFF|p",
    "Pittsburgh|Pirates|27251F|FDB827|FFFFFF","San Diego|Padres|2F241D|FFC425|FFFFFF","San Francisco|Giants|FD5A1E|27251F|EFD19F",
    "Seattle|Mariners|0C2C56|005C5C|C4CED4","St. Louis|Cardinals|C41E3A|0C2340|FEDB00","Tampa Bay|Rays|092C5C|8FBCE6|F5D130",
    "Texas|Rangers|003278|C0111F|FFFFFF","Toronto|Blue Jays|134A8E|1D2D5C|E8291C","Washington|Nationals|AB0003|14225A|FFFFFF" ] },
  basketball: { label: "Basketball", emoji: "🏀", list: [
    "Atlanta|Hawks|E03A3E|C1D32F|26282A","Boston|Celtics|007A33|BA9653|FFFFFF","Brooklyn|Nets|000000|FFFFFF|A5ACAF",
    "Charlotte|Hornets|1D1160|00788C|A1A1A4","Chicago|Bulls|CE1141|000000|FFFFFF","Cleveland|Cavaliers|860038|FDBB30|041E42",
    "Dallas|Mavericks|00538C|002B5E|B8C4CA","Denver|Nuggets|0E2240|FEC524|8B2131","Detroit|Pistons|C8102E|1D42BA|BEC0C2",
    "Golden State|Warriors|1D428A|FFC72C|FFFFFF","Houston|Rockets|CE1141|000000|C4CED4","Indiana|Pacers|002D62|FDBB30|BEC0C2",
    "Los Angeles|Clippers|C8102E|1D428A|BEC0C2","Los Angeles|Lakers|552583|FDB927|FFFFFF","Memphis|Grizzlies|5D76A9|12173F|F5B112",
    "Miami|Heat|98002E|F9A01B|000000","Milwaukee|Bucks|00471B|EEE1C6|0077C0","Minnesota|Timberwolves|0C2340|236192|78BE20",
    "New Orleans|Pelicans|0C2340|C8102E|85714D","New York|Knicks|006BB6|F58426|BEC0C2","Oklahoma City|Thunder|007AC1|EF3B24|002D62",
    "Orlando|Magic|0077C0|C4CED4|000000","Philadelphia|76ers|006BB6|ED174C|002B5C","Phoenix|Suns|1D1160|E56020|000000",
    "Portland|Trail Blazers|E03A3E|000000|FFFFFF","Sacramento|Kings|5A2D81|63727A|000000","San Antonio|Spurs|C4CED4|000000|FFFFFF",
    "Toronto|Raptors|CE1141|000000|A1A1A4","Utah|Jazz|002B5C|00471B|F9A01B","Washington|Wizards|002B5C|E31837|C4CED4" ] },
  hockey: { label: "Hockey", emoji: "🏒", list: [
    "Anaheim|Ducks|F47A38|B9975B|000000","Boston|Bruins|FFB81C|000000|FFFFFF","Buffalo|Sabres|002654|FCB514|ADAFAA",
    "Calgary|Flames|C8102E|F1BE48|000000","Carolina|Hurricanes|CC0000|000000|A2AAAD","Chicago|Blackhawks|CF0A2C|000000|FF671F",
    "Colorado|Avalanche|6F263D|236192|A2AAAD","Columbus|Blue Jackets|002654|CE1126|A4A9AD","Dallas|Stars|006847|8F8F8C|000000",
    "Detroit|Red Wings|CE1126|FFFFFF|000000","Edmonton|Oilers|041E42|FF4C00|FFFFFF","Florida|Panthers|041E42|C8102E|B9975B",
    "Los Angeles|Kings|111111|A2AAAD|FFFFFF","Minnesota|Wild|154734|A6192E|DDCBA4","Montreal|Canadiens|AF1E2D|192168|FFFFFF",
    "Nashville|Predators|FFB81C|041E42|FFFFFF","New Jersey|Devils|CE1126|000000|FFFFFF","New York|Islanders|00539B|F47D30|FFFFFF",
    "New York|Rangers|0038A8|CE1126|FFFFFF","Ottawa|Senators|C52032|000000|C2912C","Philadelphia|Flyers|F74902|000000|FFFFFF",
    "Pittsburgh|Penguins|000000|CFC493|FCB514","San Jose|Sharks|006D75|EA7200|000000","Seattle|Kraken|001628|99D9D9|E9072B",
    "St. Louis|Blues|002F87|FCB514|041E42","Tampa Bay|Lightning|002868|FFFFFF|000000","Toronto|Maple Leafs|00205B|FFFFFF|A2AAAD",
    "Utah|Mammoth|6CACE4|010101|FFFFFF","Vancouver|Canucks|00205B|00843D|97999B","Vegas|Golden Knights|B4975A|333F42|C8102E",
    "Washington|Capitals|C8102E|041E42|FFFFFF","Winnipeg|Jets|041E42|004C97|AC162C" ] }
};

// Teams that no longer exist under that name/city (used in All-Time mode). Home jersey colors, approximate.
// flags: w = white home base, p = pinstripes
const HISTORIC = {
  football: [
    "Houston|Oilers|4B92DB|C8102E|FFFFFF","Baltimore|Colts|003DA5|FFFFFF|A2AAAD","Washington|Redskins|5A1414|FFB612|FFFFFF",
    "St. Louis|Cardinals (NFL)|C41E3A|FFFFFF|000000","Boston|Patriots|C60C30|0C2340|FFFFFF",
    "Tampa Bay|Buccaneers (1976–96)|FF7900|D50A0A|FFFFFF", ],
  baseball: [
    "Montreal|Expos|003DA5|BA0C2F|FFFFFF","New York|Giants (baseball)|27251F|FD5A1E|FFFFFF",
    "Boston|Braves|13274F|CE1141|FFFFFF","Seattle|Pilots|0C2340|FFB612|FFFFFF",
    "Kansas City|Athletics|006747|FFB612|FFFFFF","Philadelphia|Athletics|003831|EFB21E|FFFFFF","St. Louis|Browns|8B4513|FF7F00|FFFFFF",
    "Florida|Marlins|00A3AD|000000|C0C0C0","Tampa Bay|Devil Rays|092C5C|00A3AD|FFFFFF","California|Angels|BA0021|003263|FFFFFF",
    "Cleveland|Indians|0C2340|E31937|FFFFFF","Houston|Colt .45s|002D62|EB6E1F|FFFFFF", ],
  basketball: [
    "Seattle|SuperSonics|00653A|FFC200|FFFFFF","New Jersey|Nets|002A60|CE1141|FFFFFF","Vancouver|Grizzlies|00B2A9|6F263D|000000",
    "Charlotte|Bobcats|1D1160|F9A01B|A1A1A4","New Orleans|Hornets|00778B|280071|FFC72C","Washington|Bullets|CE1141|002B5C|FFFFFF",
    "Kansas City|Kings|0C2340|CE1141|FFFFFF","San Diego|Clippers|CE1141|002B5C|FFFFFF","New Orleans|Jazz|4B2E83|FFC200|00471B",
    "Minneapolis|Lakers|0C2340|FDB927|FFFFFF","Syracuse|Nationals|00471B|FFFFFF|000000","Buffalo|Braves|F58426|002B5C|FFFFFF",
    "Cincinnati|Royals|0C2340|CE1141|FFFFFF","Philadelphia|Warriors|0C2340|FDB927|FFFFFF", ],
  hockey: [
    "Hartford|Whalers|003DA5|00843D|C0C0C0|w","Quebec|Nordiques|003DA5|BA0C2F|FFFFFF|w","Minnesota|North Stars|154734|FFB612|FFFFFF|w",
    "Atlanta|Thrashers|041E42|0069A5|C69214","Winnipeg|Jets (1972–96)|004C97|CE1126|C0C0C0|w","Atlanta|Flames|C8102E|F1BE48|FFFFFF|w",
    "Colorado|Rockies (NHL)|003DA5|C8102E|FFFFFF|w","Cleveland|Barons|C8102E|003DA5|FFFFFF|w",
    "California|Golden Seals|00843D|FFB612|FFFFFF|w","Arizona|Coyotes|8C2633|E2D6B5|111111","Mighty Ducks|of Anaheim|4F1C86|00B2A9|C0C0C0|w",
    "Montreal|Maroons|7B1C2E|FFFFFF|000000","Hamilton|Tigers|FFB612|000000|FFFFFF","Philadelphia|Quakers|FF8200|000000|FFFFFF" ]
};

const DIVISIONS = {"St. Louis Cardinals": "NL Central", "Colorado Rockies": "NL West", "Buffalo Bills": "AFC East", "Miami Dolphins": "AFC East", "New England Patriots": "AFC East", "New York Jets": "AFC East", "Baltimore Ravens": "AFC North", "Cincinnati Bengals": "AFC North", "Cleveland Browns": "AFC North", "Pittsburgh Steelers": "AFC North", "Houston Texans": "AFC South", "Indianapolis Colts": "AFC South", "Jacksonville Jaguars": "AFC South", "Tennessee Titans": "AFC South", "Denver Broncos": "AFC West", "Kansas City Chiefs": "AFC West", "Las Vegas Raiders": "AFC West", "Los Angeles Chargers": "AFC West", "Dallas Cowboys": "NFC East", "New York Giants": "NFC East", "Philadelphia Eagles": "NFC East", "Washington Commanders": "NFC East", "Chicago Bears": "NFC North", "Detroit Lions": "NFC North", "Green Bay Packers": "NFC North", "Minnesota Vikings": "NFC North", "Atlanta Falcons": "NFC South", "Carolina Panthers": "NFC South", "New Orleans Saints": "NFC South", "Tampa Bay Buccaneers": "NFC South", "Arizona Cardinals": "NFC West", "Los Angeles Rams": "NFC West", "San Francisco 49ers": "NFC West", "Seattle Seahawks": "NFC West", "Baltimore Orioles": "AL East", "Boston Red Sox": "AL East", "New York Yankees": "AL East", "Tampa Bay Rays": "AL East", "Toronto Blue Jays": "AL East", "Chicago White Sox": "AL Central", "Cleveland Guardians": "AL Central", "Detroit Tigers": "AL Central", "Kansas City Royals": "AL Central", "Minnesota Twins": "AL Central", "Houston Astros": "AL West", "Los Angeles Angels": "AL West", "Oakland Athletics": "AL West", "Seattle Mariners": "AL West", "Texas Rangers": "AL West", "Atlanta Braves": "NL East", "Miami Marlins": "NL East", "New York Mets": "NL East", "Philadelphia Phillies": "NL East", "Washington Nationals": "NL East", "Chicago Cubs": "NL Central", "Cincinnati Reds": "NL Central", "Milwaukee Brewers": "NL Central", "Pittsburgh Pirates": "NL Central", "St. Louis Cardinals (NFL)": "NFC East", "Arizona Diamondbacks": "NL West", "Colorado Rockies (NHL)": "Smythe Division", "Los Angeles Dodgers": "NL West", "San Diego Padres": "NL West", "San Francisco Giants": "NL West", "Boston Celtics": "Atlantic Division (NBA)", "Brooklyn Nets": "Atlantic Division (NBA)", "New York Knicks": "Atlantic Division (NBA)", "Philadelphia 76ers": "Atlantic Division (NBA)", "Toronto Raptors": "Atlantic Division (NBA)", "Chicago Bulls": "Central Division (NBA)", "Cleveland Cavaliers": "Central Division (NBA)", "Detroit Pistons": "Central Division (NBA)", "Indiana Pacers": "Central Division (NBA)", "Milwaukee Bucks": "Central Division (NBA)", "Atlanta Hawks": "Southeast Division", "Charlotte Hornets": "Southeast Division", "Miami Heat": "Southeast Division", "Orlando Magic": "Southeast Division", "Washington Wizards": "Southeast Division", "Denver Nuggets": "Northwest Division", "Minnesota Timberwolves": "Northwest Division", "Oklahoma City Thunder": "Northwest Division", "Portland Trail Blazers": "Northwest Division", "Utah Jazz": "Northwest Division", "Golden State Warriors": "Pacific Division (NBA)", "Los Angeles Clippers": "Pacific Division (NBA)", "Los Angeles Lakers": "Pacific Division (NBA)", "Phoenix Suns": "Pacific Division (NBA)", "Sacramento Kings": "Pacific Division (NBA)", "Dallas Mavericks": "Southwest Division", "Houston Rockets": "Southwest Division", "Memphis Grizzlies": "Southwest Division", "New Orleans Pelicans": "Southwest Division", "San Antonio Spurs": "Southwest Division", "Boston Bruins": "Atlantic Division (NHL)", "Buffalo Sabres": "Atlantic Division (NHL)", "Detroit Red Wings": "Atlantic Division (NHL)", "Florida Panthers": "Atlantic Division (NHL)", "Montreal Canadiens": "Atlantic Division (NHL)", "Ottawa Senators": "Atlantic Division (NHL)", "Tampa Bay Lightning": "Atlantic Division (NHL)", "Toronto Maple Leafs": "Atlantic Division (NHL)", "Carolina Hurricanes": "Metropolitan Division", "Columbus Blue Jackets": "Metropolitan Division", "New Jersey Devils": "Metropolitan Division", "New York Islanders": "Metropolitan Division", "New York Rangers": "Metropolitan Division", "Philadelphia Flyers": "Metropolitan Division", "Pittsburgh Penguins": "Metropolitan Division", "Washington Capitals": "Metropolitan Division", "Chicago Blackhawks": "Central Division (NHL)", "Colorado Avalanche": "Central Division (NHL)", "Dallas Stars": "Central Division (NHL)", "Minnesota Wild": "Central Division (NHL)", "Nashville Predators": "Central Division (NHL)", "St. Louis Blues": "Central Division (NHL)", "Utah Mammoth": "Central Division (NHL)", "Winnipeg Jets": "Central Division (NHL)", "Anaheim Ducks": "Pacific Division (NHL)", "Calgary Flames": "Pacific Division (NHL)", "Edmonton Oilers": "Pacific Division (NHL)", "Los Angeles Kings": "Pacific Division (NHL)", "San Jose Sharks": "Pacific Division (NHL)", "Seattle Kraken": "Pacific Division (NHL)", "Vancouver Canucks": "Pacific Division (NHL)", "Vegas Golden Knights": "Pacific Division (NHL)", "Houston Oilers": "AFC Central", "Baltimore Colts": "AFC East", "Washington Redskins": "NFC East", "Tampa Bay Buccaneers (1976–96)": "NFC Central", "Boston Patriots": "AFL Eastern Division", "Montreal Expos": "NL East", "Florida Marlins": "NL East", "New York Giants (baseball)": "National League (no divisions)", "Boston Braves": "National League (no divisions)", "Houston Colt .45s": "National League (no divisions)", "Seattle Pilots": "AL West", "California Angels": "AL West", "Kansas City Athletics": "American League (no divisions)", "Philadelphia Athletics": "American League (no divisions)", "St. Louis Browns": "American League (no divisions)", "Tampa Bay Devil Rays": "AL East", "Cleveland Indians": "AL Central", "Seattle SuperSonics": "Northwest Division", "New Jersey Nets": "Atlantic Division (NBA)", "Washington Bullets": "Atlantic Division (NBA)", "Buffalo Braves": "Atlantic Division (NBA)", "Vancouver Grizzlies": "Midwest Division", "Kansas City Kings": "Midwest Division", "Charlotte Bobcats": "Southeast Division", "New Orleans Hornets": "Southwest Division", "San Diego Clippers": "Pacific Division (NBA)", "New Orleans Jazz": "Central Division (NBA)", "Minneapolis Lakers": "Western Division", "Syracuse Nationals": "Eastern Division", "Cincinnati Royals": "Eastern Division", "Philadelphia Warriors": "Eastern Division", "Hartford Whalers": "Northeast Division", "Quebec Nordiques": "Adams Division", "Cleveland Barons": "Adams Division", "Minnesota North Stars": "Norris Division", "Atlanta Thrashers": "Southeast Division", "Winnipeg Jets (1972–96)": "Smythe Division", "Atlanta Flames": "Patrick Division", "California Golden Seals": "West Division", "Arizona Coyotes": "Central Division (NHL)", "Mighty Ducks of Anaheim": "Pacific Division (NHL)", "Montreal Maroons": "Canadian Division", "Hamilton Tigers": "Canadian Division", "Philadelphia Quakers": "American Division"};

function buildTeam(row, sport) {
  const [city, nick, c1, c2, c3, f = ""] = row.split("|");
  let base = "#" + c1, a = "#" + c2, b = "#" + c3;
  if (f.includes("w")) { base = "#f7f7f7"; a = "#" + c1; b = "#" + c2; }   // white home jersey, team colors as trim
  const name = `${city} ${nick}`;
  return { name, sport, div: DIVISIONS[name], c1: base, c2: a, c3: b, pin: f.includes("p") };
}
for (const [k, s] of Object.entries(TEAMS)) {
  s.current = s.list.map(r => buildTeam(r, k));
  s.alltime = s.current.concat((HISTORIC[k] || []).map(r => buildTeam(r, k)));
}
