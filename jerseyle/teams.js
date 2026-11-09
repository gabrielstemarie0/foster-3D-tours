// city|nickname|primary|secondary|accent[|p = pinstripes]
const TEAMS = {
  football: { label: "Football", emoji: "🏈", list: [
    "Arizona|Cardinals|97233F|FFFFFF|000000","Atlanta|Falcons|A71930|000000|A5ACAF","Baltimore|Ravens|241773|9E7C0C|000000",
    "Buffalo|Bills|00338D|C60C30|FFFFFF","Carolina|Panthers|0085CA|101820|BFC0BF","Chicago|Bears|0B162A|C83803|FFFFFF",
    "Cincinnati|Bengals|FB4F14|000000|FFFFFF","Cleveland|Browns|FF3C00|311D00|FFFFFF","Dallas|Cowboys|003594|869397|FFFFFF",
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
    "Boston|Red Sox|BD3039|0C2340|FFFFFF","Chicago|Cubs|0E3386|CC3433|FFFFFF|p","Chicago|White Sox|27251F|C4CED4|FFFFFF",
    "Cincinnati|Reds|C6011F|000000|FFFFFF","Cleveland|Guardians|00385D|E50022|FFFFFF","Colorado|Rockies|33006F|C4CED4|000000|p",
    "Detroit|Tigers|0C2340|FA4616|FFFFFF","Houston|Astros|002D62|EB6E1F|F4911E","Kansas City|Royals|004687|BD9B60|FFFFFF",
    "Los Angeles|Angels|BA0021|003263|C4CED4","Los Angeles|Dodgers|005A9C|EF3E42|FFFFFF","Miami|Marlins|00A3E0|EF3340|000000",
    "Milwaukee|Brewers|12284B|FFC52F|FFFFFF","Minnesota|Twins|002B5C|D31145|CFAB7A","New York|Mets|002D72|FF5910|FFFFFF|p",
    "New York|Yankees|0C2340|C4CED3|FFFFFF|p","Oakland|Athletics|003831|EFB21E|FFFFFF","Philadelphia|Phillies|E81828|002D72|FFFFFF",
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
for (const s of Object.values(TEAMS)) s.teams = s.list.map(r => {
  const [city, nick, c1, c2, c3, p] = r.split("|");
  return { name: `${city} ${nick}`, nick, c1: "#" + c1, c2: "#" + c2, c3: "#" + c3, pin: p === "p" };
});
